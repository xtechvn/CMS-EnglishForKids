using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Utilities.Common;
using Utilities.ViewModels.Article;

namespace Utilities
{
    public class UpLoadHelper
    {
        static string apiUploadFile = "https://static-image.adavigo.com/File/Upload";
        static string apiPrefix = "https://static-image.adavigo.com/images/upload";
        static string apiUploadVideo = "https://localhost:44377/Video/upload-video";
        static string key_token_api = "wVALy5t0tXEgId5yMDNg06OwqpElC9I0sxTtri4JAlXluGipo6kKhv2LoeGQnfnyQlC07veTxb7zVqDVKwLXzS7Ngjh1V3SxWz69";
        static string AES_KEY = "bXny0OMniop5U1fpZ6u7zAHg7KxRdUcp7OuhU7L9Oo62k+FLShyDuwjBGuXWtRMK";
        static string AES_IV = "KFavGEDPdhddqjl9CQVC2c0jYoMJKzmqlBDS+JBbSK6QwgG79XWs9ltH0i5DaJm2";
        /// <summary>
        /// UploadImageBase64
        /// </summary>
        /// <param name="ImageBase64">src of image</param>
        /// <returns></returns>
        public static async Task<string> UploadImageBase64(ImageBase64 modelImage)
        {
            string ImagePath = string.Empty;
            string tokenData = string.Empty;
            try
            {

                var j_param = new Dictionary<string, string> {
                    { "data_file", modelImage.ImageData },
                    { "extend", modelImage.ImageExtension }};

                using (HttpClient httpClient = new HttpClient())
                {
                    tokenData = CommonHelper.Encode(JsonConvert.SerializeObject(j_param), key_token_api);
                    var contentObj = new { token = tokenData };
                    var content = new StringContent(JsonConvert.SerializeObject(contentObj), Encoding.UTF8, "application/json");
                    var result = await httpClient.PostAsync(apiPrefix, content);
                    dynamic resultContent = Newtonsoft.Json.Linq.JObject.Parse(result.Content.ReadAsStringAsync().Result);
                    if (resultContent.status == 0)
                    {
                        return resultContent.url_path;
                    }
                    else
                    {
                        LogHelper.InsertLogTelegram("UploadImageBase64. Result: " + resultContent.status + ". Message: " + resultContent.msg);
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("UploadImageBase64 - " + ex.Message.ToString() + " Token:" + tokenData);
            }
            return ImagePath;
        }

        public static async Task<string> UploadBase64Src(string ImageSrc, string StaticDomain)
        {
            try
            {
                var objimage = StringHelpers.GetImageSrcBase64Object(ImageSrc);
                if (objimage != null)
                {
                    objimage.ImageData = ResizeBase64Image(objimage.ImageData, out string FileType);
                    if (!string.IsNullOrEmpty(FileType)) objimage.ImageExtension = FileType;
                    if (string.IsNullOrEmpty(objimage.ImageData))
                    {
                        try
                        {
                            objimage.ImageData = ImageSrc.Split(',')[1];
                        }
                        catch
                        {
                            objimage.ImageData = ImageSrc;
                        }
                    }
                    return await UploadImageBase64(objimage);
                }
                else
                {
                    if (ImageSrc.StartsWith(StaticDomain))
                        return ImageSrc.Replace(StaticDomain, string.Empty);
                    else
                        return ImageSrc;
                }
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram("UploadImageBase64 - " + ex.Message.ToString());
            }
            return string.Empty;
        }

        /// <summary>
        /// Resize image with maximum 1000px width
        /// </summary>
        /// <param name="ImageBase64"></param>
        /// <returns></returns>
        public static string ResizeBase64Image(string ImageBase64, out string FileType)
        {
            FileType = null;
            try
            {
                var IsValid = StringHelpers.TryGetFromBase64String(ImageBase64, out byte[] ImageByte);
                if (IsValid)
                {
                    using (var memoryStream = new MemoryStream(ImageByte))
                    {
                        var RootImage = Image.FromStream(memoryStream);
                        if (RootImage.Width > 1000)
                        {
                            int width = 1000;
                            int height = (int)(width / ((double)RootImage.Width / RootImage.Height));
                            var ResizeImage = (Image)(new Bitmap(RootImage, new Size(width, height)));
                            using (var stream = new MemoryStream())
                            {
                                ResizeImage.Save(stream, System.Drawing.Imaging.ImageFormat.Jpeg);
                                ImageByte = stream.ToArray();
                            }
                            FileType = "jpg";
                            return Convert.ToBase64String(ImageByte);
                        }
                        else
                        {
                            return ImageBase64;
                        }
                    }
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                return null;
            }
        }
        public static async Task<string> UploadFileOrImage(IFormFile file, long dataId, int type)
        {
            if (file == null || file.Length <= 0)
                throw new Exception("File không hợp lệ.");

            try
            {
                // Danh sách phần mở rộng hợp lệ
                //var validImageExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var validFileExtensions = new[] { ".pdf", ".doc", ".docx", ".txt", ".xls", ".xlsx",".mp4" };

                var extension = Path.GetExtension(file.FileName).ToLower();

                if ( !validFileExtensions.Contains(extension))
                {uq
                    throw new Exception($"Định dạng file {extension} không được hỗ trợ.");
                }

                byte[] AESKey = EncryptService.Get_AESKey(EncryptService.ConvertBase64StringToByte(AES_KEY));
                byte[] AESIV = EncryptService.Get_AESIV(EncryptService.ConvertBase64StringToByte(AES_IV));

                string token = GenerateToken(AESKey, AESIV);

                using var formData = new MultipartFormDataContent();
                using var fileStream = file.OpenReadStream();

                formData.Add(new StreamContent(fileStream), "data", file.FileName);
                formData.Add(new StringContent(file.FileName), "name");
                formData.Add(new StringContent(dataId.ToString()), "data_id");
                formData.Add(new StringContent(type.ToString()), "type");
                formData.Add(new StringContent(token), "token");

                using var httpClient = new HttpClient();
                var response = await httpClient.PostAsync(apiUploadFile, formData);
                var responseContent = await response.Content.ReadAsStringAsync();

                dynamic jsonResponse = JsonConvert.DeserializeObject(responseContent);
                if (response.IsSuccessStatusCode && jsonResponse?.status == 0)
                {
                    return $"https://static-image.adavigo.com{jsonResponse.url}";
                }

                LogHelper.InsertLogTelegram($"UploadFileOrImage Failed: {jsonResponse?.msg}");
                return null;
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"UploadFileOrImage Exception: {ex.Message}");
                throw;
            }
        }


        private static string GenerateToken(byte[] AESKey, byte[] AESIV)
        {
            try
            {
                var currentTime = DateTime.UtcNow.ToString("o");
                return EncryptService.ConvertByteToBase64String(EncryptService.AES_EncryptToByte(currentTime, AESKey, AESIV));
            }
            catch (Exception ex)
            {
                LogHelper.InsertLogTelegram($"GenerateToken Error: {ex.Message}");
                return null;
            }
        }
    }
}
