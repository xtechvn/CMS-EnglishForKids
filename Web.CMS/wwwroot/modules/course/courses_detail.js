var _wrapperImage = $("#video-content");
var _attachfile = $("#lightgallery");
$(document).ready(function () {
    /*
    $('.datepicker-input').Zebra_DatePicker({
        format: 'd/m/Y H:i',
        onSelect: function () {
            $(this).change();
        }
    }).removeAttr('readonly');*/
    $('input[name="single_pick_date"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        drops: 'down',
        timePicker: true,
        timePicker24Hour: true,
        minDate: '01/01/2023 00:00',
        maxDate: '31/12/2052 23:59',
        locale: {
            format: 'DD/MM/YYYY HH:mm'
        }
    }, function (start, end, label) {

    });
    var val = $('#PublishDate').attr('value');
    $('#PublishDate').data('daterangepicker').setStartDate(val);

    if ($('#ArticleType:checked').val() == 1) {
        $('#normal_post').hide();
        $('#video_post').show();

        $('#video-preview').hide();
    };

    _wrapperImage.lightGallery();
    var News_Status = $('#News_Status').val();
    if (News_Status == 0) {
        _newsDetail1.disabledView();

    }

    const activeTab = localStorage.getItem("activeTab");
    if (activeTab) {
        $(`.tab-link[data-tab="${activeTab}"]`).click();
    }

    $(".tab-link").on("click", function () {
        const targetTab = $(this).data("tab");
        localStorage.setItem("activeTab", targetTab);
        $(".tab-content").hide();
        $(`#${targetTab}`).show();
    });
});


// ===============================================================
//Click Toogle
document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("free-course-toggle");
    const priceInput = document.getElementById("price-input");
    const originalPriceInput = document.getElementById("original-price-input");


    toggle.addEventListener("change", function () {
        if (this.checked) {
            // Khi bật toggle, đặt giá về 0 và readonly
            priceInput.value = "0";
            priceInput.readOnly = true;

            originalPriceInput.value = "0";
            originalPriceInput.readOnly = true;
        } else {
            // Khi tắt toggle, cho phép chỉnh sửa giá
            priceInput.readOnly = false;
            originalPriceInput.readOnly = false;

            priceInput.value = ""; // Reset giá trị
            originalPriceInput.value = "";
        }
    });

});
const toggleDisplayWebsite = document.getElementById("display-toggle");

var displayStatus = toggleDisplayWebsite.checked ? 0 : 2; // Trạng thái hiển thị website
// Xử lý Toggle Hiển Thị Trên Website
toggleDisplayWebsite.addEventListener("change", function () {
    displayStatus = this.checked ? 0 : 2; // 0: Hiển thị, 2: Không hiển thị
    console.log("Trạng thái hiển thị trên website:", displayStatus);
});


// Sự kiện click vào icon
$(document).on("click", ".lesson-icon", function (event) {
    event.stopPropagation(); // Ngăn click lan sang các phần tử khác

    const fileUrl = $(this).data("url"); // Lấy URL của file/video

    // Mở URL trong tab mới
    if (fileUrl) {
        window.open(fileUrl, "_blank");
    } else {
        console.error("URL file/video không tồn tại.");
    }
});
// Mở popup Thêm Tiết Học
$(document).on("click", "#btn-add-chapter", function () {
    isEditing = false; // Đặt trạng thái là "Thêm mới"
    $("#popup-title").text("Thêm tiết học"); // Cập nhật tiêu đề popup
    $("#popup-chapter-list").html(""); // Xóa dữ liệu cũ
    addNewChapter(); // Tự động thêm một ô Chapter mới

    // Mở popup
    $.magnificPopup.open({
        items: { src: "#edit-khoahoc-popup" },
        type: "inline",
        closeOnBgClick: false,
    });
});


$(document).on("click", "#btn-edit-chapters", function () {
    const courseId = $("#Id").val();

    // Kiểm tra nếu chưa có khóa học
    if (!courseId || courseId <= 0) {
        Swal.fire("Bạn cần lưu khóa học trước khi sửa tiết học!", "", "warning");
        return;
    }
    isEditing = true; // Đặt trạng thái là "Sửa"
    $("#popup-title").text("Sửa tiết học"); // Cập nhật tiêu đề popup

    // Gửi AJAX lấy thông tin chương
    $.ajax({
        url: `/Courses/GetChapterDetails?courseId=${courseId}`,
        type: "GET",
        success: function (response) {
            debugger
            console.log(response.data)
            if (response.isSuccess) {
                const chapters = response.data;
                renderChaptersToPopup(chapters);

                // Mở popup
                $.magnificPopup.open({
                    items: { src: "#edit-khoahoc-popup" },
                    type: "inline",
                    closeOnBgClick: false,
                });
            } else {
                Swal.fire("Lỗi", response.message, "error");
            }
        },
        error: function () {
            Swal.fire("Không thể tải tiết học", "", "error");
        },
    });
});

// Thêm Chapter mới

// Sự kiện click vào icon để mở trình chọn file
$(document).on("click", ".lesson-icon1", function () {
    const fileInput = $(this).siblings(".lesson-file"); // Lấy input file liên quan
    fileInput.trigger("click"); // Kích hoạt trình chọn file
});

// Hiển thị tên file khi người dùng chọn file
$(document).on("change", ".lesson-file", function () {
    const file = this.files[0]; // Lấy file được chọn
    const lessonIcon = $(this).siblings(".lesson-icon1"); // Lấy icon liên quan

    if (file) {
        const fileType = file.type; // Kiểm tra kiểu file
        if (fileType.startsWith("video")) {
            // Nếu là video, đổi icon thành PlayCircle
            lessonIcon.attr("src", "/images/icons/PlayCircle.svg");
        } else if (fileType === "application/pdf") {
            // Nếu là PDF, đổi icon thành BookOpenText
            lessonIcon.attr("src", "/images/icons/BookOpenText.svg");
        } else {
            // Mặc định nếu không đúng loại file
            lessonIcon.attr("src", "/images/icons/FilePlus.svg");
        }
    } else {
        // Nếu không chọn file, đưa về trạng thái ban đầu
        lessonIcon.attr("src", "/images/icons/FilePlus.svg");
    }
});


//=================================================================
function addNewChapter() {

    // Kiểm tra các Chapter hiện tại đã có Lesson chưa
    let canAddChapter = true;


    $("#popup-chapter-list .item").each(function () {
        const chapterTitle = $(this).find(".chapter-title").val().trim();
        const hasLesson = $(this).find("li.ui-state-default").length > 0;

        if (!chapterTitle || !hasLesson) {
            canAddChapter = false;
        }
    });
    if (!canAddChapter) {
        Swal.fire("Lỗi", "Vui lòng hoàn thành Chapter và thêm ít nhất một bài học trước khi tạo Chapter mới!", "error");
        return;
    }
    const newCollapseId = `collapse-new-${chapterCounter}`;
    const lessonListId = `lessons-new-${chapterCounter}`;

    const newChapterHtml = `
    <div class="item" data-chapter-id="0">
        <div class="title title-add" id="headingThree"">
            <input class="form-control chapter-title" type="text" placeholder="Vui lòng nhập tiết " />
           <a href="javascript:void(0);"style="justify-content: end;" > <i class="icofont-ui-edit mr-2 add-lesson" data-chapter-index="new-${chapterCounter}"></i></a>
        </div>
        <div id="${newCollapseId}" class="collapse show">
            <ul class="lesson-list" id="${lessonListId}">
                <li class="ui-state-default" style="
    padding: 10px 0;
    background: none;
    border: none;">
                <div class="thumb-video" style="display:flex;width: 100%;">
                <img class="lesson-icon1"
             src="/images/icons/FilePlus.svg"
             style="font-size: 24px; cursor: pointer; padding-left: 10px;" />
        <input type="file" class="lesson-file" name="files" accept="video/*,application/pdf" style="display: none;" />
        <span class="flex-tt" style="
    
    width: 100%;
    display: flex;
">
            <input class="form-control w-100 lesson-title" style="
    background: none;
    border: none;
"F type="text" placeholder="Vui lòng nhập tên bài giảng" />
        </span>
         
                  <img class="delete-lesson" src="/images/icons/Trash.svg" 
alt="Xóa" style="cursor: pointer; width: 24px;  margin: 0px 10px;" />                                 
                                            
                </div>
               
            </li>
            </ul>
        </div>
    </div>`;
    // Xóa nút Thêm Tiết Học hiện tại và thêm Chapter mới
    $("#popup-chapter-list #add-new-chapter-btn").remove();
    $("#popup-chapter-list").append(newChapterHtml);

    // Thêm lại nút Thêm Tiết Học ở dưới cùng
    addNewChapterButton();

    chapterCounter++;
}

// Thêm nút "Thêm Tiết Học" vào Popup
function addNewChapterButton() {
    const addChapterButtonHtml = `
        <div class="text-center mt-3" id="add-new-chapter-btn">
            <button type="button" class="btn btn-primary" id="add-new-chapter">+ Thêm Tiết Học</button>
        </div>`;
    // Đảm bảo nút luôn nằm ở cuối
    $("#popup-chapter-list").append(addChapterButtonHtml);
}
// Sự kiện cho nút Thêm Tiết Học 
$(document).on("click", "#add-new-chapter", function () {
    addNewChapter();
});
function renderChaptersToPopup(chapters) {
    const $chapterList = $("#popup-chapter-list"); // Gán vào danh sách trong popup
    $chapterList.empty(); // Xóa dữ liệu cũ

    // Duyệt qua từng Chapter và render
    chapters.forEach((chapter, chapterIndex) => {
        debugger
        //const chapterId = `chapter-${chapterIndex}`;
        const collapseId = `collapse-${chapterIndex}`;
        const lessonListId = `lessons-${chapterIndex}`;
        const chapterId = chapter.id || 0;
        // Render các bài giảng (Lesson) trong Chapter
        const lessonsHtml = chapter.lessons.map((lesson, lessonIndex) => `
       
           <li class="ui-state-default" data-lesson-id="${lesson.id || 0}" style="padding: 10px 0; background: none; border: none;">
                <div class="thumb-video" style="display: flex; width: 100%;">
                    <img class="lesson-icon1"
                         src="${lesson.thumbnailName ? (lesson.thumbnailName.endsWith('.pdf') ? '/images/icons/BookOpenText.svg' : '/images/icons/PlayCircle.svg') : '/images/icons/FilePlus.svg'}"
                         style="font-size: 24px; cursor: pointer; padding-left: 10px; width: auto; height: auto;" />
                    <input type="file" class="lesson-file" name="files" accept="video/*,application/pdf" style="display: none;" />
                    <span class="flex-tt" style="width: 100%; display: flex;">
                        <input class="form-control w-100 lesson-title" style="background: none; border: none;" 
                               type="text" value="${lesson.title || ''}" placeholder="Vui lòng nhập tên bài giảng" />
                    </span>
                     <img class="delete-lesson" src="/images/icons/Trash.svg" 
             alt="Xóa" style="cursor: pointer; width: 24px;  margin: 0px 10px;" data-lesson-id="${lesson.id || 0}" />
                   
                </div>
            </li>
        `).join("");

        // Render Chapter
        const chapterHtml = `
            <div class="item" data-chapter-id="${chapterId}">
                <div class="title">
                    <a data-toggle="collapse" data-target="#${collapseId}">
                        <input class="form-control chapter-title" type="text" value="${chapter.title}" />
                       
                        
                        <a href="javascript:void(0);"style="justify-content: end;" > <i class="icofont-ui-edit mr-2 add-lesson" data-chapter-index="${chapterIndex}"></i></a>
                    </a>
                </div>
                <div id="${collapseId}" class="collapse" aria-labelledby="${chapterId}" data-parent="#accordionExample">
                    <div class="card-body">
                        <ul id="${lessonListId}">${lessonsHtml}</ul>
                    </div>
                </div>
            </div>
        `;

        // Thêm Chapter vào danh sách
        $chapterList.append(chapterHtml);

    });
    $("#popup-chapter-list #add-new-chapter-btn").remove();
    // Thêm nút Thêm Tiết Học cho tất cả popup
    addNewChapterButton();

}


let chapterCounter = 1; // Đếm số lượng Chapter để tạo ID duy nhất
let lessonCounter = 1; // Đếm số lượng Lesson để tạo ID duy nhất cho mỗi bài giảng



// Gắn sự kiện cho nút thêm Lesson trong Chapter
$(document).on("click", ".add-lesson", function () {
    debugger

    const chapterIndex = $(this).data("chapter-index");
    const lessonListId = `#lessons-${chapterIndex}`; // Tạo selector cho danh sách Lesson

    const newLesson = `
            <li class="ui-state-default" style="
    padding: 10px 0;
    background: none;
    border: none;">
                <div class="thumb-video" style="display:flex;width: 100%;">
                <img class="lesson-icon1"
             src="/images/icons/FilePlus.svg"
             style="font-size: 24px; cursor: pointer; padding-left: 10px; width: auto;
    height: auto;" />
        <input type="file" class="lesson-file" name="files" accept="video/*,application/pdf" style="display: none;" />
        <span class="flex-tt" style="

    width: 100%;
    display: flex;
">
            <input class="form-control w-100 lesson-title" style="
    background: none;
    border: none;" type="text" placeholder="Vui lòng nhập tên bài giảng" />
        </span>
                <img class="delete-lesson" src="/images/icons/Trash.svg"
alt="Xóa" style="cursor: pointer; width: 24px;  margin: 0px 10px;" />


                </div>

            </li>
        `;

    // Thêm Lesson mới vào danh sách Lesson
    $(lessonListId).append(newLesson);

    lessonCounter++; // Tăng bộ đếm Lesson
});
// Xử lý sự kiện xóa bài giảng
$(document).on("click", ".delete-lesson", function () {
    const $lessonItem = $(this).closest("li.ui-state-default");
    const lessonId = $(this).data("lesson-id");
    const $chapter = $(this).closest(".item"); // Phần tử DOM của chapter
    if (!lessonId) {
        Swal.fire("Lỗi", "Không thể xóa bài giảng không hợp lệ!", "error");
        return;
    }

    if (lessonId) {
        Swal.fire({
            title: "Bạn có chắc chắn muốn xóa bài giảng này?",
            text: "Bài giảng sẽ bị xóa vĩnh viễn!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Có",
            cancelButtonText: "Không",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `/Courses/DeleteLesson/${lessonId}`,
                    type: "DELETE",
                    success: function (response) {
                        if (response.isSuccess) {
                            Swal.fire("Thành công", response.message, "success").then(() => {
                                $lessonItem.remove(); // Xóa bài giảng khỏi giao diện

                                // Kiểm tra nếu không còn bài giảng trong chapter
                                if ($chapter.find("li.ui-state-default").length === 0) {
                                    $chapter.remove(); // Xóa chapter khỏi giao diện
                                }
                            });
                        } else {
                            Swal.fire("Lỗi", response.message, "error");
                        }
                    },
                    error: function () {
                        Swal.fire("Lỗi", "Không thể xóa bài giảng. Vui lòng thử lại sau.", "error");
                    },
                });
            }
        });
    } else {
        $lessonItem.remove();
    }
});

/// Gắn sự kiện lưu Chapter và Lessons
$(document).on("click", "#save-chapters", function () {
    debugger
    const chapters = [];
    const formData = new FormData();
    let isValid = true;

    $("#popup-chapter-list .item").each(function (chapterIndex) {
        const chapterId = $(this).data("chapter-id") || 0;
        const chapterTitle = $(this).find(".chapter-title").val().trim();
        const lessons = [];

        if (!chapterTitle) {
            Swal.fire("Lỗi", "Vui lòng nhập tên tiết học!", "error");
            isValid = false;
            return false;
        }

        $(this).find("li.ui-state-default").each(function (lessonIndex) {
            debugger
            const lessonId = $(this).data("lesson-id") || 0;
            const lessonTitle = $(this).find(".lesson-title").val().trim();
            const lessonFile = $(this).find(".lesson-file")[0]?.files[0];

            if (!lessonTitle) {
                Swal.fire("Lỗi", "Vui lòng nhập tên bài giảng!", "error");
                isValid = false;
                return false;
            }

            if (lessonFile) {
                formData.append("files", lessonFile); // Gửi file
                formData.append("fileKeys", `chapter-${chapterIndex}-lesson-${lessonIndex}`); // Gửi metadata ánh xạ
            }

            lessons.push({
                Id: lessonId,
                Title: lessonTitle,
                Thumbnail: lessonFile ? lessonFile.name : null,
                ThumbnailName: lessonFile ? lessonFile.name : null
            });
        });

        if (!isValid) return false;

        chapters.push({
            Id: chapterId,
            Title: chapterTitle,
            Lessions: lessons,
            CourseId: $("#Id").val()
        });
    });

    if (!isValid) return;

    formData.append("chapters", JSON.stringify(chapters));
    console.log(formData);

    $.ajax({
        url: "/Courses/UpsertChapterAndLesson",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.isSuccess) {
                Swal.fire("Thành công", "Lưu tiết học thành công!", "success").then(() => {
                    loadChapters($("#Id").val());
                });
                $.magnificPopup.close();
            } else {
                Swal.fire("Lỗi", response.message, "error");
            }
        },
        error: function () {
            Swal.fire("Lỗi", "Đã xảy ra lỗi khi lưu dữ liệu!", "error");
        },
    });
});



_common.tinyMce('#text-editor');

$(document).on("click", ".tab-link", function (event) {
    debugger
    event.preventDefault(); // Ngăn hành động mặc định

    const targetTab = $(this).data("tab"); // Lấy tab được chỉ định
    const courseId = $("#Id").val(); // Lấy ID khóa học từ input ẩn

    // Gắn sự kiện vào nút "open-popup"
    $(document).on("click", ".open-popup", function (e) {
        e.preventDefault(); // Ngăn hành động mặc định (đổi URL)

        const targetPopup = $(this).attr("href"); // Lấy giá trị href (id của popup)

        // Kiểm tra nếu popup tồn tại trong DOM
        if ($(targetPopup).length) {
            $.magnificPopup.open({
                items: { src: targetPopup },
                type: "inline",
                closeOnBgClick: false // Đóng khi nhấn ngoài popup
            });
        } else {
            console.error("Popup không tồn tại:", targetPopup);
        }
    });

    if (targetTab === "chapters-tab") {
        if (!courseId || courseId <= 0) {
            // Nếu khóa học chưa được lưu
            Swal.fire({
                title: "Bạn cần lưu khóa học để tạo chương",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Có",
                cancelButtonText: "Không",
            }).then((result) => {
                if (result.isConfirmed) {
                    // Gọi hàm lưu khóa học
                    _newsDetail1.OnSave('0');
                }
            });
        } else {
            // Nếu khóa học đã lưu, tải nội dung tiết học
            loadChapters(courseId);
            $(".tab-content").hide(); // Ẩn tất cả các tab
            $(`#${targetTab}`).show(); // Hiển thị tab "chapters-tab"
        }
    } else {
        // Chuyển tab bình thường
        $(".tab-content").hide();
        $(`#${targetTab}`).show();
    }


});

// Hàm tải nội dung tiết học bằng AJAX
function loadChapters(courseId) {
    debugger
    $.ajax({
        url: `/Courses/Chapters?courseId=${courseId}`,
        type: "GET",
        success: function (response) {
            $("#chapters-container").html(response); // Chèn dữ liệu vào container
        },
        error: function () {
            Swal.fire("Lỗi", "Không thể tải tiết học. Vui lòng thử lại sau!", "error");
        },
    });
}


$('#detail-cate-panel .btn-toggle-cate').click(function () {
    var seft = $(this);
    if (seft.hasClass("plus")) {
        seft.siblings('ul.lever2').show();
        seft.removeClass('plus').addClass('minus');
    } else {
        seft.siblings('ul.lever2').hide();
        seft.removeClass('minus').addClass('plus');
    }
});

$('#news-tag').tagsinput({
    typeahead: {
        source: function (query) {
            var dataList = $.ajax({
                type: 'Post',
                url: "/News/GetSuggestionTag",
                async: false,
                dataType: 'json',
                data: {
                    name: query,
                },
                done: function (data) {
                },
                fail: function (jqXHR, textStatus, errorThrown) {
                }
            }).responseJSON;
            return dataList;
        }, afterSelect: function () {
            this.$element[0].value = '';
        }
    }
});
const iconLoading = document.getElementById("loading");
const showLoading = () => {
    iconLoading.style.display = "flex";
};
const hideLoading = () => {
    iconLoading.style.display = "none";
};
var uploadCrop = $('#croppie-content').croppie({
    viewport: {
        width: 200,
        height: 150,
        type: 'square'
    },
    boundary: {
        width: 250,
        height: 250
    },
    url: '/images/icons/noimage.png'
});


$('.sl-image-size').change(function (e) {
    var value = e.target.value;
    var width = parseInt(value.split("x")[0]);
    var height = parseInt(value.split("x")[1]);
    var filedata = $('#image_file')[0].files[0];
    $('#croppie-content').croppie('destroy');
    if (filedata) {
        $('.wrap-croppie').show();
        $('.wrap-image-preview').hide();
        $('#btn-cropimage').show();
        var reader = new FileReader();
        reader.readAsDataURL(filedata);
        reader.onload = function () {
            $('#croppie-content').croppie({
                viewport: {
                    width: width,
                    height: height,
                    type: 'square'
                },
                boundary: {
                    width: 250,
                    height: 250
                },
                url: reader.result
            });
        };
    } else {
        $('#croppie-content').croppie({
            viewport: {
                width: width,
                height: height,
                type: 'square'
            },
            boundary: {
                width: 250,
                height: 250
            },
            url: '/images/icons/noimage.png'
        });
    }
});

$('#image_file').change(function (event) {
    var _validFileExtensions = ["jpg", "jpeg", "bmp", "gif", "png"];

    if (event.target.files && event.target.files[0]) {
        var fileType = event.target.files[0].name.split('.').pop();

        if (event.target.files[0].size > (1024 * 1024)) {
            _msgalert.error('File upload hiện tại có kích thước (' + Math.round(event.target.files[0].size / 1024 / 1024, 2) + ' Mb) vượt quá 1 Mb. Bạn hãy chọn lại ảnh khác');
            $(this).val('');
        }

        if (!_validFileExtensions.includes(fileType)) {
            _msgalert.error('File upload phải thuộc các định dạng : jpg, jpeg, bmp, gif, png');
            $(this).val('');
        }

        if (_validFileExtensions.includes(fileType) && event.target.files[0].size <= (1024 * 1024)) {
            $('.wrap-croppie').show();
            $('.wrap-image-preview').hide();
            $('#btn-cropimage').show();
            $('#btn-cancel-crop').show();
            var reader = new FileReader();
            reader.onload = function (e) {
                uploadCrop.croppie('bind', {
                    url: e.target.result
                });
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }
});

$('#video-file').change(function (event) {
    var _validFileExtensions = ["mp4"];
    if (event.target.files && event.target.files[0]) {
        var fileType = event.target.files[0].name.split('.').pop();

        if (event.target.files[0].size > (100 * 1024 * 1024)) {
            _msgalert.error('File upload hiện tại có kích thước (' + Math.round(event.target.files[0].size / 1024 / 1024, 2) + ' Mb) vượt quá 100 Mb. Bạn hãy chọn lại ảnh khác');
            $(this).val('');
        }

        if (!_validFileExtensions.includes(fileType)) {
            _msgalert.error('File upload phải thuộc các định dạng : mp4');
            $(this).val('');
        }

        if (_validFileExtensions.includes(fileType) && event.target.files[0].size <= (100 * 1024 * 1024)) {
            var reader = new FileReader();
            $('#video-content').show();
            $('#video-croppie').show();

            $('#video-preview').hide();
            showLoading();
            setTimeout(() => {
                $('#uploadvieo').show();
                reader.onload = function (e) {
                    _wrapperImage.append('<video  class="col-md" id="iframe-video"  src="' + reader.result + '" controls></video>'

                        /*'<iframe style="width: 100 %;" id="iframe-video" src="' + reader.result + '"></iframe>'*/
                    );
                };
                reader.readAsDataURL(event.target.files[0]);
                hideLoading();
            }, 2000);

        }
    }
});

$('#btn-cropimage').click(function () {
    uploadCrop.croppie('result', {
        type: 'canvas',
        size: 'original'
    }).then(function (base64img) {
        $('#img_16x9').attr('src', base64img);
        $('#img_16x9').closest('.image-croped').removeClass('mfp-hide');
    });
});

$('#btn-cancel-crop').click(function () {
    $('.wrap-croppie').hide();
    // $('#btn-upload-image').show();
    $('#btn-cropimage').hide();
    $('#btn-cancel-crop').hide();
    $('.wrap-image-preview').show();
    $('#image_file').val('');
    $('.sl-image-size').val('');
    // $('.btn-dynamic-enable').prop('disabled', false);
});

$('#thumbnail_file').on('change', function (event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#img_thumbnail').attr('src', e.target.result);
            $('#thumbnail-preview').show();
        }
        reader.readAsDataURL(file);
    }
});

// Upload Video
// Sự kiện chọn file video
$("#video_intro_file").on("change", function () {
    const file = this.files[0];
    const maxFileSize = 100 * 1024 * 1024; // 100MB

    if (file) {
        // Kiểm tra kích thước và định dạng video
        if (!file.type.startsWith('video/')) {
            alert("Vui lòng chọn đúng định dạng video!");
            return;
        }

        if (file.size > maxFileSize) {
            alert("Kích thước video không được vượt quá 100MB!");
            return;
        }

        // Hiển thị video xem trước
        const videoSrc = URL.createObjectURL(file);
        $("#video_intro_src").attr("src", videoSrc);
        $("#video_intro_preview").show();
    }
});



var _newsDetail1 = {

    OnOpenRelationForm: function (id) {
        let title = 'Chèn tin liên quan';
        let url = '/News/RelationArticle';
        let param = { Id: id };
        _magnific.OpenLargerPopup(title, url, param);
    },
    RefreshlightGallery: function () {
        _wrapperImage.data('lightGallery').destroy(true);
        _wrapperImage.lightGallery();
    },


    OnSave: function (articleStatus) {
        debugger
        const formData = new FormData();
        const videoFile = $('#video_intro_file')[0].files[0];

        if (videoFile) {
            formData.append("VideoIntro", videoFile);
        }
        let formvalid = $('#form-news');
        var max_pos = $('#ArticleType:checked').val() == "0" ? 7 : 8;
        formvalid.validate({
            rules: {
                Title: {
                    required: true,
                    maxlength: 300
                },
                Lead: {
                    required: true,
                    maxlength: 400
                },
                Position: {
                    min: 0,
                    max: max_pos
                }
            },
            messages: {
                Title:
                {
                    required: "Vui lòng nhập tiêu đề cho bài viết",
                    maxlength: "Tiêu đề cho bài viết không được vượt quá 300 ký tự"
                },
                Lead: {
                    required: "Vui lòng nhập mô tả ngắn cho bài viết",
                    maxlength: "Tiêu đề cho bài viết không được vượt quá 400 ký tự"
                },
                Position: {
                    min: "Vị trí bài viết phải trong khoảng 0 đến " + max_pos,
                    max: "Vị trí bài viết phải trong khoảng 0 đến " + max_pos
                }
            }
        });

        if (formvalid.valid()) {
            var _body = tinymce.activeEditor.getContent();
            var _tags = $('#news-tag').tagsinput('items');
            var _categories = [];
            var _relatedCourseTagIds = [];

            if ($('.ckb-news-cate:checked').length > 0) {
                $('.ckb-news-cate:checked').each(function () {
                    _categories.push($(this).val());
                });
            }

            if ($('.item-related-article').length > 0) {
                $('.item-related-article').each(function () {
                    _relatedCourseTagIds.push(parseFloat($(this).data('id')));
                });
            }

            if (_categories.length <= 0) {
                _msgalert.error('Bạn phải chọn chuyên mục cho bài viết');
                return false;
            }
            if ($('#Description').val().length >= 400) {
                _msgalert.error('Tiêu đề cho bài viết không được vượt quá 400 ký tự');
                return false;
            }
            var _model = {
                Id: $('#Id').val(),
                Title: $('#Title').val(),
                Description: $('#Description').val(),
                Thumbnail: $('#img_16x9').attr('src') == undefined ? "" : $('#img_16x9').attr('src'),
                //VideoIntro: videoFile,
                Benefif: _body,  // Giả sử là "Benefit" mà bạn cần sử dụng
                Status: displayStatus,  // Status of course (Published/Unpublished)
                Price: $('#Price').val(),
                OriginalPrice: $('#OriginalPrice').val(),

                Type: $('#ArticleType:checked').val(),
                //AuthorId: $('#AuthorId').val(),
                //CreatedBy: $('#CreatedBy').val(),
                CreatedDate: ConvertToJSONDateTime($('#PublishDate').val()),
                //UpdatedBy: $('#UpdatedBy').val(),
                //UpdatedDate: $('#UpdatedDate').val(),
                Tags: _tags,
                Categories: _categories,
                RelatedCourseTagIds: _relatedCourseTagIds,
                Position: $('#Position').val(),

                //PublishDate: $('#PublishDate').val(),
                //DownTime: $('#DownTime').val()
            }
            if (_model.ArticleType == 1) {
                _model.Benefif = $('#link-video').attr('src') == undefined ? "" : $('#link-video').attr('src');
            }

            if (_model.Thumbnail == "") {
                _msgalert.error('Bạn phải upload  ảnh  cho khóa học');
                return false;
            }
            if (_model.VideoIntro == "") {
                _msgalert.error('Bạn phải upload  Video cho khóa học');
                return false;
            }
            // Đưa dữ liệu JSON vào FormData
            formData.append("data", JSON.stringify(_model));

            $.ajax({

                url: '/courses/upsert',
                type: 'POST',
                data: formData,
                dataType: 'JSON',
                contentType: false,
                processData: false,    // Không xử lý dữ liệu FormData
                traditional: true,
                // data: { model: _model },
                success: function (result) {
                    debugger
                    if (result.isSuccess) {
                        _msgalert.success(result.message);
                        $('#Id').val(result.dataId); // Gán lại ID khóa học
                        // Kiểm tra nếu là lưu để chuyển sang Tiết Học

                        // Hiển thị video thành công từ server
                        if (result.videoPath) {
                            $("#video_intro_src").attr("src", result.videoPath);
                            $("#video_intro_preview").show();
                        }

                        setTimeout(function () {
                            window.location.href = `/courses/detail/${result.dataId}`;
                        }, 300);

                    } else {
                        _msgalert.error(result.message);
                    }
                },
                error: function (jqXHR) {

                }
            });
        } else {
            _msgalert.error('Bạn phải nhập thông tin đầy đủ và chính xác cho bài viết');
        }
    },



    OnChangeArticleStatus: function (id, status) {
        let actionName = '';
        let title = 'Cập nhật trạng thái bài viết';

        switch (parseInt(status)) {
            case 0:
                actionName = "đăng bài viết";
                break;
            case 2:
                actionName = "hạ bài viết";
                break;
        }

        let description = 'Bạn có chắc chắn muốn ' + actionName + '?';

        _msgconfirm.openDialog(title, description, function () {
            $.ajax({
                url: '/courses/ChangeArticleStatus',
                type: 'POST',
                data: { Id: id, articleStatus: status },
                success: function (result) {
                    if (result.isSuccess) {
                        _msgalert.success(result.message);
                        setTimeout(function () {
                            window.location.href = "/courses/detail/" + result.dataId;

                        }, 200);
                    } else {
                        _msgalert.error(result.message);
                    }
                },
                error: function (jqXHR) {
                }
            });
        });
    },
    disabledView: function () {
        debugger
        $('input[type="text"], input[type="checkbox"], input[type="radio"], select, button, textarea').prop('disabled', true);
        $('#ha_bai_viet').prop('disabled', false);
    },

    OnDelete: function (id) {
        let title = 'Xác nhận xóa bài viết';
        let description = 'Bạn có chắc chắn muốn xóa bài viết này?';

        _msgconfirm.openDialog(title, description, function () {
            $.ajax({
                url: '/news/DeleteArticle',
                type: 'POST',
                data: { Id: id },
                success: function (result) {
                    if (result.isSuccess) {
                        _msgalert.success(result.message);
                        setTimeout(function () {
                            window.location.href = "/news";
                        }, 200);
                    } else {
                        _msgalert.error(result.message);
                    }
                },
                error: function (jqXHR) {
                }
            });
        });
    },
    Onchen: function (input) {
        var iframevideo = $('#iframe-video').attr('src') == undefined ? "" : $('#iframe-video').attr('src')
        if (input == 0 && iframevideo == "") {

            $('#normal_post').show();

            $('#video_post').hide();
        }
        if (input == 1 && iframevideo == "") {
            $('#normal_post').hide();
            $('#video_post').show();
            $('#video-preview').show();
        }
        if (input == 0 && iframevideo != "") {
            var result = confirm("Dữ liệu bài video sẽ bị xóa. Bạn có chắc chắn không ?");
            if (result == true) {
                $('#normal_post').show();
                $('#iframe-video').remove();
                location.reload('#video_post');
                $('#video_post').hide();
            }

        }
        if (input == 1 && iframevideo != "") {
            var result = confirm("Dữ liệu bài thường sẽ bị xóa. Bạn có chắc chắn không ?");
            if (result == true) {
                $('#normal_post').hide();
                $('#iframe-video').remove();
                $('#video_post').show();

            }
        }
        if (input == 0) {
            $('#Position').attr('max', '7');
        }
        if (input == 1) {
            $('#Position').attr('max', '8');
        }
    },
    DeleteVideo: function () {
        $('#iframe-video').remove();
        $('#video-preview').show();
        $('#video_post').show();
    },
    OnseverVideo: function () {
        var _model = {

            Body: $('#iframe-video').attr('src') == undefined ? "" : $('#iframe-video').attr('src'),
            ArticleType: $('#ArticleType:checked').val(),
        }
        console.log(_model.Body);

        $.ajax({
            url: '/AttachFile/UploadFileVideo',
            type: 'POST',
            data: JSON.stringify(_model),
            dataType: 'JSON',
            contentType: "application/json",
            traditional: true,
            // data: { model: _model },
            success: function (result) {
                if (result.isSuccess) {
                    _msgalert.success(result.message);

                    _attachfile.append('<video style="display:none"  class="col-md" id="link-video"  src="' + result.dataId + '" controls></video>');

                    /**/
                    _newsDetail1.RefreshlightGallery();
                } else {
                    _msgalert.error(result.message);
                }
            },
            error: function (jqXHR) {

            }
        });
    },

    EditNewDetail: function (id, status) {
        let title = 'Xác nhận hạ bài viết';
        let description = 'Bài viết đang hiển thị ngoài mặt trang sẽ bị hạ.Bạn có đồng ý không?';
        _msgconfirm.openDialog(title, description, function () {
            $.ajax({
                url: '/news/ChangeArticleStatus',
                type: 'POST',
                data: { Id: id, articleStatus: status },
                success: function (result) {
                    if (result.isSuccess) {
                        _msgalert.success(result.message);
                        setTimeout(function () {
                            window.location.href = "/news/detail/" + result.dataId;

                        }, 200);
                    } else {
                        _msgalert.error(result.message);
                    }
                },
                error: function (jqXHR) {
                }
            });
        });
    },
}