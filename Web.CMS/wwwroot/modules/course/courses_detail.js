var _wrapperImage = $("#video-content");
var _attachfile = $("#lightgallery");
$(document).ready(function () {

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

    // Khi tải trang, kiểm tra tab nào đang được lưu trong localStorage
    const activeTab = localStorage.getItem("activeTab");
    if (activeTab) {
        // Hiển thị tab đã lưu trong localStorage
        $(`.tab-link[data-tab="${activeTab}"]`).addClass("active");
        $(".tab-content").hide(); // Ẩn tất cả nội dung
        $(`#${activeTab}`).addClass("active").show(); // Hiển thị nội dung của tab đã lưu
    } else {
        // Nếu không có tab nào được lưu, mặc định chọn tab đầu tiên
        $(".tab-link").first().addClass("active");
        $(".tab-content").first().addClass("active").show();
    }

    // Xử lý sự kiện khi nhấp vào một tab
    $(".tab-link").on("click", function () {
        const targetTab = $(this).data("tab"); // Lấy tab mục tiêu
        localStorage.setItem("activeTab", targetTab); // Lưu tab vào localStorage

        // Cập nhật giao diện Tabs
        $(".tab-link").removeClass("active"); // Xóa lớp active khỏi tất cả Tabs
        $(this).addClass("active"); // Thêm lớp active cho Tab được chọn

        // Hiển thị nội dung của Tab được chọn
        $(".tab-content").removeClass("active").hide(); // Ẩn tất cả nội dung
        $(`#${targetTab}`).addClass("active").show(); // Hiển thị nội dung của Tab được chọn
    });
});
_common.tinyMce('#text-editor');
//===========================================================================================




// Check chuyển Tab
$(document).on("click", ".tab-link", function (event) {
    debugger

    event.preventDefault(); // Ngăn hành động mặc định

    const targetTab = $(this).data("tab"); // Lấy tab được chỉ định
    const courseId = $("#Id").val(); // Lấy ID khóa học từ input ẩn


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




//================================================================================
let chapterCounter = 1; // Đếm số lượng phần (chapter)
let lessonCounter = 1; // Đếm số lượng bài giảng (lesson)



// Thêm Bài Giảng vào Phần
$(document).on("click", ".add-lesson-btn", function () {
    const chapterId = $(this).data("chapter-id");

    const newLessonHtml = `
            <div class="box-add-chap" id="lesson-${lessonCounter}">
                <div class="title-block txt_16 mb-0 justify-content-between w-100">
                    <div class="d-flex gap10">
                        <i class="icofont-check-circled mt-1 mr-2"></i>
                        <span class="text-nowrap">Bài giảng mới:</span>
                        <span>
                            <i class="icofont-file-alt mr-2"></i>
                            <input class="form-control lesson-title" type="text" placeholder="Nhập tên bài giảng" style="display: inline-block; width: auto;" />
                        </span>
                        <a href="javascript:void(0)" class="delete-lesson"><i class="icofont-trash del"></i></a>
                    </div>
                </div>
            </div>`;
    $(`#lesson-list-${chapterId}`).append(newLessonHtml); // Thêm bài giảng mới vào danh sách của chương
    lessonCounter++;
});

// Xóa Bài Giảng
$(document).on("click", ".delete-lesson", function () {
    $(this).closest(".box-add-chap").remove(); // Xóa bài giảng tương ứng
});

// Cập nhật tiêu đề Phần
$(document).on("input", ".chapter-title", function () {
    const title = $(this).val().trim();
    if (!title) {
        $(this).closest(".block-chap").find(".tt-phan").text("Phần chưa xuất bản:");
    } else {
        $(this).closest(".block-chap").find(".tt-phan").text(`Phần: ${title}`);
    }
});
// ===============================================================
//Click Toogle Gíá
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
//========================================================================
/// Lấy phần tử nút
const displayButton = document.getElementById("display-button");

// Khởi tạo trạng thái dựa trên nội dung ban đầu của nút
let displayStatus = displayButton.textContent.trim() === "Đã Xuất Bản" ? 0 : 2; // 0: Hiển thị, 2: Không hiển thị

// Xử lý sự kiện khi nhấn nút
displayButton.addEventListener("click", function () {
    // Toggle trạng thái
    displayStatus = displayStatus === 0 ? 2 : 0;

    // Cập nhật giao diện nút
    this.textContent = displayStatus === 0 ? "Đã Xuất Bản" : "Xuất Bản";

    // Log trạng thái mới (có thể gửi đến server nếu cần)
    //console.log("Trạng thái hiển thị trên website:", displayStatus);
});

//========================================================================



// Khởi tạo Magnific Popup
$('.lesson-icon').magnificPopup({
    type: 'iframe',
    mainClass: 'mfp-fade', // Hiệu ứng fade
    removalDelay: 300, // Thời gian chuyển động
    preloader: false, // Tắt preloader
    fixedContentPos: true, // Đảm bảo popup giữ nguyên vị trí
    iframe: {
        patterns: {
            youtube: {
                index: 'youtube.com/',
                id: 'v=',
                src: '//www.youtube.com/embed/%id%?autoplay=1'
            },
            vimeo: {
                index: 'vimeo.com/',
                id: '/',
                src: '//player.vimeo.com/video/%id%?autoplay=1'
            },
            default: {
                src: '%id%' // Đường dẫn trực tiếp (direct link)
            }
        }
    },
    callbacks: {
        open: function () {
            console.log("Popup đã mở");
        },
        close: function () {
            console.log("Popup đã đóng");
        }
    }
});

// Sự kiện click vào icon
$(document).on("click", ".lesson-icon", function (event) {
    event.preventDefault();

    const fileUrl = $(this).data("url"); // Lấy URL của file/video
    const fileExtension = fileUrl.split('.').pop().toLowerCase(); // Lấy phần mở rộng file

    if (fileExtension === "mp4") {
        // Mở video dạng MP4
        $.magnificPopup.open({
            items: {
                src: fileUrl
            },
            type: 'iframe'
        });
    } else if (fileExtension === "pdf") {
        // Mở PDF
        window.open(fileUrl, "_blank");
    } else {
        console.error("File không hỗ trợ hoặc không tồn tại!");
    }
});
// ====================================================================

// Mở popup Thêm Tiết Học


// Gí vào Sửa
//$(document).on("click", "#btn-edit-chapters", function () {
//    const courseId = $("#Id").val();

//    // Kiểm tra nếu chưa có khóa học
//    if (!courseId || courseId <= 0) {
//        Swal.fire("Bạn cần lưu khóa học trước khi sửa tiết học!", "", "warning");
//        return;
//    }
//    isEditing = true; // Đặt trạng thái là "Sửa"
//    $("#popup-title").text("Sửa tiết học"); // Cập nhật tiêu đề popup

//    // Gửi AJAX lấy thông tin chương
//    $.ajax({
//        url: `/Courses/GetChapterDetails?courseId=${courseId}`,
//        type: "GET",
//        success: function (response) {
//            debugger
//            console.log(response.data)
//            if (response.isSuccess) {
//                const chapters = response.data;
//                renderChaptersToPopup(chapters);

//                // Mở popup
//                $.magnificPopup.open({
//                    items: { src: "#edit-khoahoc-popup" },
//                    type: "inline",
//                    closeOnBgClick: false,
//                });
//            } else {
//                Swal.fire("Lỗi", response.message, "error");
//            }
//        },
//        error: function () {
//            Swal.fire("Không thể tải tiết học", "", "error");
//        },
//    });
//});



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
$(document).on("input", ".chapter-title", function () {
    const maxLength = $(this).attr("maxlength");
    const currentLength = $(this).val().length;

    // Hiển thị số ký tự hiện tại và tối đa
    $(this).siblings(".character-count").text(`${currentLength}/${maxLength}`);
});

//=============================================================================
//MỚIIIIIIIIIIIIII
function SendRequest(url, data, successMessage, reloadCallback) {
    debugger
    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (reponse) {
            debugger
            if (reponse.isSuccess) {
                Swal.fire("Thành công", successMessage, "success").then(() => {
                    loadChapters(data.CourseId); // Reload lại danh sách chapters
                });
            } else {
                Swal.fire("Lỗi", response.message, "error");
            }
        },
        error: function () {
            Swal.fire("Lỗi", "Đã xảy ra lỗi trong quá trình xử lý!", "error");
        },
    })
}



// Thêm mới Chapter
$(document).on("click", "#btn-add-chapter1", function () {
    debugger
    openItemForm("Chapter", "Thêm mới Phần");
});



// Xử lý click cho nút thêm/sửa Chapter và Lesson
$(document).on("click", ".btn-add-type, .btn-edit-item", function () {
    debugger
    const type = $(this).data("type") || $(this).data("item-type");
    const id = $(this).data("item-id") || 0;
    let parentId;
    


    let container;
    if (type === "Chapter") {
        if ($(this).hasClass("btn-edit-item")) {
            // Sửa Chapter
            container = $(this).closest(".block-chap");
        } else {
            // Thêm Chapter mới
            container = $("#chapter-list");
        }
    } else {
        if ($(this).hasClass("btn-edit-item")) {
            // Sửa Lesson
            container = $(this).closest(".box-add-chap");
            parentId = container.data("parent-id") || 0
        } else {
            // Thêm Lesson mới
            container = $(this).closest(".block-chap");
            parentId = $(this).data("parent-id") || 0
        }
    }

    const title = $(this).hasClass("btn-edit-item")
        ? container.find(".item-title").first().text().trim()
        : "";

    
    // Ẩn tiêu đề gốc nếu đang sửa
    if ($(this).hasClass("btn-edit-item")) {
        container.find(".item-header, .title-block").first().hide();
    }

    // Mở form
    openItemForm(container, type, title, id, parentId);
});
function openItemForm(container,type, title, id = 0, parentId = 0, additionalData = {}) {
    debugger
    const placeholderText = type === "Chapter" ? "Vui lòng nhập tên phần" : "Vui lòng nhập tên bài học";
    const headerText = type === "Chapter" ? "Phần chưa xuất bản" : "Bài Học chưa xuất bản";
    const actionText = id === 0 ? "Thêm" : "Lưu";

    // Cập nhật nội dung Form
    const formHtml = `
        <div class="box-add-chap">
            <div class="d-flex gap10" style="align-items: center;">
                <p class="title-block txt_16 align-items-start mb-0">
                    <i class="icofont-check-circled mt-1 mr-2"></i>
                    <span class="text-nowrap">${headerText}:</span>
                </p>
                <div class="custom-input w-100">
                    <input type="text" class="form-control item-title" placeholder="${placeholderText}" value="${title}" maxlength="200" />
                    <span class="character-count custom-label">0/200</span>
                </div>
            </div>
            <div class="flex align-items-center justify-content-end mt20 gap10">
                <button type="button" class="btn btn-default orange line btn-cancel-item">Hủy</button>
                <button type="button" class="btn btn-default orange round btn-save-item"
                    data-item-id="${id}" 
                    data-item-type="${type}" 
                    data-parent-id="${parentId}">
                    ${actionText} ${type === "Chapter" ? "Phần" : "Bài Học"}
                </button>
            </div>
        </div>
    `;

    // Hiển thị Form trong container

    if (type === "Chapter" && id == 0) {
        // Với Chapter, thêm form vào cuối danh sách Chapters
        container.append(`<div class="block-chap">${formHtml}</div>`);
    }
   

    $(".item-title").focus(); // Đặt focus vào input
    container.find("> .item-content").html(formHtml).show();
    container.find(".item-title").focus();

    // Cập nhật số ký tự
    container.find(".item-title").on("input", function () {
        const charCount = $(this).val().length;
        $(this).siblings(".character-count").text(`${charCount}/200`);
    });
}
$(document).on("click", ".btn-save-item", function () {
       debugger
    const type = $(this).data("item-type");
    const id = $(this).data("item-id") || 0;
    let parentId = $(this).data("parent-id") || 0;
    //const title = container.find(".item-title").val().trim();
    const courseId = $("#Id").val();

    let title;

    // Xử lý riêng cho Chapter và Lesson
    if (type === "Chapter") {
        // Đối với Chapter, input nằm trong .box-add-chap
        title = $(this).closest(".block-chap").find("input.item-title").val().trim();
    } else {
        // Đối với Lesson, input cũng nằm trong .box-add-chap
        title = $(this).closest(".box-add-chap").find("input.item-title").val().trim();
    }

    if (type === "Lesson") {
        parentId = $(this).data("parent-id"); // Lấy ChapterId nếu là Lesson
    }

    if (!title) {
        Swal.fire("Lỗi", "Vui lòng nhập tên!", "error");
        return;
    }

    const item = {
        Id: id,
        Title: title,
        Type: type,
        ParentId: parentId,
        CourseId: courseId
    };

    SendRequest(
        "/Courses/AddorUpdateItem",
        item,
        "Thao tác thành công!",
        () => location.reload()
    );
});
$(document).on("click", ".btn-delete-item", function () {
    debugger
    const id = $(this).data("item-id"); // Lấy ID của item
    const type = $(this).data("item-type"); // Lấy loại của item (Chapter hoặc Lesson)

    Swal.fire({
        title: `Bạn có chắc muốn xóa ${type === "Chapter" ? "Phần" : "Bài Học"} này?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
    }).then((result) => {
        if (result.isConfirmed) {
            // Gửi yêu cầu xóa qua API
            $.ajax({
                url: "/Courses/DeleteItem",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ id, type }),
                success: function (response) {
                    debugger
                    if (response.isSuccess) {
                        Swal.fire("Thành công", response.message, "success").then(() => {
                            $(`[data-item-id="${id}"][data-item-type="${type}"]`).remove(); // Xóa item khỏi DOM
                        });
                    } else {
                        Swal.fire("Lỗi", response.message, "error");
                    }
                },
                error: function () {
                    Swal.fire("Lỗi", "Đã xảy ra lỗi trong quá trình xóa!", "error");
                },
            });
        }
    });
});

$(document).on("click", ".btn-cancel-item", function () {
    debugger
    const block = $(this).closest(".box-add-chap");

    // Kiểm tra nếu là thêm mới Chapter
    if ($("#new-chapter-container").has(block).length > 0) {
        $("#new-chapter-container").html(""); // Xóa container thêm mới
        $("#btn-add-chapter1").show(); // Hiển thị lại nút thêm mới
    } else {
        // Nếu là sửa Chapter
        const chapterId = $(this).closest(".block-chap").data("chapter-id");
        loadChapters($("#Id").val()); // Tải lại danh sách chapters để phục hồi trạng thái ban đầu
    }
});

//Lession


$(document).on("change", ".custom-file-input", function () {
    var fileName = $(this).val().split("\\").pop(); // Lấy tên file
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

// Hiển thị các nút "Bài giảng" và "Trắc nghiệm"
$(document).on("click", ".btn-add-content", function () {
    const parent = $(this).closest(".box-add-chap");
    const options = parent.find(".content-options");

    // Ẩn tất cả các content-options khác
    $(".content-options").not(options).hide();

    // Hiển thị hoặc ẩn tùy chọn của mục hiện tại
    options.toggle();
});


// Xử lý nút Nội dung mới
function toggleContent(lessonId) {
    const lesson = document.getElementById(lessonId); // Tìm lesson block dựa vào id
    if (!lesson) {
        console.error(`Lesson with id "${lessonId}" not found`);
        return;
    }

    const content = lesson.querySelector('.lesson-content'); // Lấy phần nội dung
    const chevron = lesson.querySelector('.btn-chevron'); // Lấy nút chevron

    // Kiểm tra trạng thái hiển thị và thực hiện toggle
    if (content.style.display === 'none') {
        content.style.display = 'flex'; // Hiển thị
        chevron.classList.add('active'); // Xoay chevron
    } else {
        content.style.display = 'none'; // Ẩn
        chevron.classList.remove('active'); // Reset chevron
    }
}
// Khi nhấn "Nội dung"
$(document).on("click", ".btn-toggle-content", function () {
    const lessonBlock = $(this).closest(".lesson-block");
    const wrapper = lessonBlock.find(".lesson-content");
    const commonPanel = wrapper.find(".common-panel");
    const currentPanel = commonPanel.attr("data-current-panel");
   
    // Ẩn panel hiện tại nếu không phải mặc định
    if (currentPanel && currentPanel !== "default") {
        wrapper.find(`.panel-${currentPanel}`).hide();
    }

    // Ẩn panel mặc định (Mô tả và Tài nguyên)
    wrapper.find(".panel-default").hide();

    // Hiển thị panel Nội dung
    commonPanel.attr("data-current-panel", "content");
    wrapper.find(".panel-content").show();
    wrapper.show(); // Đảm bảo wrapper không bị ẩn
});

// Xử lý click vào option video
$(document).on("click", '.option-box[data-type="video"]', function () {
    const lessonBlock = $(this).closest('.box-add-chap');
    const contentPanel = lessonBlock.find('.content-panel');
    const videoPanel = lessonBlock.find('.video-upload-panel');

    contentPanel.slideUp();
    videoPanel.slideDown();
});

// Xử lý nút đóng
$(document).on('click', '.btn-close', function (e) {  // Thêm tham số e vào đây
    e.preventDefault();
    e.stopPropagation();

    const lessonBlock = $(this).closest('.box-add-chap');
    const contentPanel = lessonBlock.find('.content-panel');
    const videoPanel = lessonBlock.find('.video-upload-panel');

    contentPanel.slideUp(200);  // Thêm animation cho mượt
    videoPanel.slideUp(200);
});

$(document).on("change", ".custom-file-input.auto-upload", function () {
    const input = $(this);
    const files = this.files;
    const lessonId = input.data("lesson-id");

    if (files.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        formData.append("lessonId", lessonId);

        $.ajax({
            url: "/Courses/UploadFile",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function () {
                input.siblings(".upload-progress").show();
                $(".progress-bar").css("width", "0%");
            },
            xhr: function () {
                const xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (e) {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        $(".progress-bar").css("width", percentComplete + "%");
                    }
                });
                return xhr;
            },
            success: function (response) {
                if (response.isSuccess) {
                    debugger
                    renderFileList(lessonId, response.data);
                } else {
                    alert(response.message);
                }
            },
            complete: function () {
                $(".upload-progress").hide();
            }
        });
    }
});

// Render danh sách file
function renderFileList(lessonId, files) {
    const fileList = $(`#fileList_${lessonId}`);
    fileList.empty(); // Xóa danh sách cũ

    files.forEach((file) => {
        const newRow = `
            <tr>
                <td>${file.path}</td>
                <td>${file.ext}</td>
                <td>Hoàn thành</td>
                <td>${new Date(file.createDate)}</td>
                
            </tr>`;
        fileList.append(newRow);
    });
}


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


// Sửa Chapter
//$(document).on("click", ".btn-edit-chapters1", function () {
//    debugger
//    const block = $(this).closest(".block-chap");
//    const chapterId = $(this).data("chapter-id");
//    const currentTitle = block.find(".chapter-title").text().trim();

//    const editHtml = `


//         <div class="box-add-chap">
//                   <div class="d-flex gap10" style="
//                           align-items: center;
//                       ">
//                       <p class="title-block txt_16 align-items-start mb-0"><i class="icofont-check-circled mt-1 mr-2"></i><span
//                               class="text-nowrap">Phần chưa xuất bản:</span></p>
//                       <div class="custom-input w-100">
//                       <input type="text" class="form-control chapter-title" value="${currentTitle}"  placeholder="Vui lòng nhập tên phần"
//                      maxlength="200" />
//                           <span  class="character-count custom-label ">0/200</span>
//                       </div>
//                   </div>
//                   <div class="flex align-items-center justify-content-end mt20 gap10">
//                    <button type="button"   class="btn btn-default orange line btn-cancel-chapter" >Hủy</button>
//                       <button type="button" id="save-chapters1" data-chapter-id="${chapterId}" class="btn btn-default orange round">Lưu bài giảng</button>
//                   </div>

//               </div>


//    `;

//    block.find(".chapter-header").html(editHtml);
//});
// Hủy thêm mới hoặc sửa Chapter






$(document).on("click", "#save-chapters1", function () {
    debugger
    const block = $(this).closest(".box-add-chap"); // Giới hạn phạm vi tìm kiếm
    const title = block.find(".chapter-title").val().trim();
    const chapterId = $(this).data("chapter-id") || 0;
    const courseId = $("#Id").val();
    let isValid = true;
    if (!title) {
        Swal.fire("Lỗi", "Vui lòng nhập tên phần!", "error");
        isValid = false;
        return false;
    }



    const chapters = {
        Id: chapterId,
        Title: title,
        CourseId: courseId,
    };

    // Gọi API tạo chapter mới
    $.ajax({
        url: "/Courses/AddorUpdateItem",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(chapters),

        success: function (response) {
            debugger
            if (response.isSuccess) {
                Swal.fire("Thành công", "Thêm phần mới thành công!", "success").then(() => {
                    loadChapters(courseId); // Reload lại danh sách chapters
                });
            } else {
                Swal.fire("Lỗi", response.message, "error");
            }
        },
        error: function () {
            Swal.fire("Lỗi", "Đã xảy ra lỗi khi thêm phần mới!", "error");
        }
    });
});
// Hàm tải nội dung tiết học bằng AJAX


// Hủy chỉnh sửa Chapter


//function addNewChapterButton() {
//    const addChapterButtonHtml = `
//        <div class="text-center mt-3" id="add-new-chapter-btn">
//            <button type="button" class="btn btn-primary" id="add-new-chapter">+ Thêm Tiết Học</button>
//        </div>`;
//    // Đảm bảo nút luôn nằm ở cuối
//    $("#popup-chapter-list").append(addChapterButtonHtml);
//}
//// Sự kiện cho nút Thêm Tiết Học 
//$(document).on("click", "#add-new-chapter", function () {
//    addNewChapter();
//});
//function renderChaptersToPopup(chapters) {
//    const $chapterList = $("#popup-chapter-list"); // Gán vào danh sách trong popup
//    $chapterList.empty(); // Xóa dữ liệu cũ

//    // Duyệt qua từng Chapter và render
//    chapters.forEach((chapter, chapterIndex) => {
//        const currentCharacterCount = chapter.title?.length || 0
//        debugger
//        //const chapterId = `chapter-${chapterIndex}`;
//        const collapseId = `collapse-${chapterIndex}`;
//        const lessonListId = `lessons-${chapterIndex}`;
//        const chapterId = chapter.id || 0;
//        // Render các bài giảng (Lesson) trong Chapter
//        const lessonsHtml = chapter.lessons.map((lesson, lessonIndex) => `

//           <li class="ui-state-default" data-lesson-id="${lesson.id || 0}" style="padding: 10px 0; background: none; border: none;">
//                <div class="thumb-video" style="display: flex; width: 100%;">
//                    <img class="lesson-icon1"
//                         src="${lesson.thumbnailName ? (lesson.thumbnailName.endsWith('.pdf') ? '/images/icons/BookOpenText.svg' : '/images/icons/PlayCircle.svg') : '/images/icons/FilePlus.svg'}"
//                         style="font-size: 24px; cursor: pointer; padding-left: 10px; width: auto; height: auto;" />
//                    <input type="file" class="lesson-file" name="files" accept="video/*,application/pdf" style="display: none;" />
//                    <span class="flex-tt" style="width: 100%; display: flex;">
//                        <input class="form-control w-100 lesson-title" style="background: none; border: none;" 
//                               type="text" value="${lesson.title || ''}" placeholder="Vui lòng nhập tên bài giảng" />
//                    </span>
//                     <img class="delete-lesson" src="/images/icons/Trash.svg" 
//             alt="Xóa" style="cursor: pointer; width: 24px; height: 24px;  margin: 0px 10px;" data-lesson-id="${lesson.id || 0}" />

//                </div>
//            </li>
//        `).join("");

//        // Render Chapter
//        const chapterHtml = `
//            <div class="item" data-chapter-id="${chapterId}">
//                <div class="title">
//                    <a data-toggle="collapse" data-target="#${collapseId}">
//                        <input class="form-control chapter-title" type="text" style="width: 100%;"  maxlength="200"  value="${chapter.title}" />
//                         <span class="character-count">${currentCharacterCount}/200</span>


//                        <a href="javascript:void(0);"style="justify-content: end;width: 5%;" > <i class="icofont-ui-edit mr-2 add-lesson" data-chapter-index="${chapterIndex}"></i></a>
//                    </a>
//                </div>
//                <div id="${collapseId}" class="collapse" aria-labelledby="${chapterId}" data-parent="#accordionExample">
//                    <div class="card-body">
//                        <ul id="${lessonListId}">${lessonsHtml}</ul>
//                    </div>
//                </div>
//            </div>
//        `;

//        // Thêm Chapter vào danh sách
//        $chapterList.append(chapterHtml);

//    });
//    $("#popup-chapter-list #add-new-chapter-btn").remove();
//    // Thêm nút Thêm Tiết Học cho tất cả popup
//    addNewChapterButton();

//}





//===========================================================================================

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
alt="Xóa" style="cursor: pointer; width: 24px; height:24px;  margin: 0px 10px;" />


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








//========================================================================================================================================================================================
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

var uploadCrop;
uploadCrop = $('#croppie-container').croppie({
    viewport: { width: 300, height: 200, type: 'square' },
    boundary: { width: 350, height: 250 },
    enableExif: true,
});
// Khi chọn file ảnh
$("#image_file").on("change", function (event) {
    const file = this.files[0];
    const maxFileSize = 1 * 1024 * 1024; // 1 MB
    const validExtensions = ["jpg", "jpeg", "bmp", "gif", "png"];

    if (file) {
        const fileType = file.name.split('.').pop().toLowerCase();

        // Hiển thị tên file trên nhãn
        $("label[for='image_file']").text(file.name);

        if (!validExtensions.includes(fileType)) {
            alert("File upload phải thuộc các định dạng: jpg, jpeg, bmp, gif, png.");
            this.value = "";
            $("label[for='image_file']").text("Không có file nào được chọn");
            return;
        }

        if (file.size > maxFileSize) {
            alert("Kích thước file không được vượt quá 1 MB.");
            this.value = "";
            $("label[for='image_file']").text("Không có file nào được chọn");
            return;
        }

        // Hiển thị croppie và ẩn các phần tử khác
        $("#image_placeholder").hide();
        $("#img_16x9").hide();
        $("#croppie-container").show();

        const reader = new FileReader();
        reader.onload = function (e) {
            uploadCrop.croppie('bind', {
                url: e.target.result
            }).then(() => {
                $('#btn-cropimage').show();
                $('#btn-cancel-crop').show();
            });
        };
        reader.readAsDataURL(file);
    }
});

// Khi nhấn nút cắt hình ảnh
$("#btn-cropimage").click(function () {
    uploadCrop.croppie('result', {
        type: 'canvas',
        size: 'viewport'
    }).then(function (base64img) {
        // Hiển thị ảnh đã cắt và ẩn croppie
        $("#img_16x9").attr("src", base64img).show();
        $("#croppie-container").hide();
        $("#btn-cropimage").hide();
        $("#btn-cancel-crop").hide();
        $("#image_file").val('');
    });
});

// Khi nhấn nút hủy bỏ
$("#btn-cancel-crop").click(function () {
    $("#croppie-container").hide();
    $("#btn-cropimage").hide();
    $("#btn-cancel-crop").hide();
    $("#img_16x9").hide();
    $("#image_placeholder").show();
    $("#image_file").val('');
    $("label[for='image_file']").text("Không có file nào được chọn");
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

// Sự kiện thay đổi file
$("#video_intro_file").on("change", function () {
    const file = this.files[0];
    const maxFileSize = 100 * 1024 * 1024; // 100MB

    if (file) {
        // Kiểm tra kích thước và định dạng video
        if (!file.type.startsWith("video/")) {
            alert("Vui lòng chọn đúng định dạng video!");
            this.value = ""; // Xóa giá trị file
            return;
        }

        if (file.size > maxFileSize) {
            alert("Kích thước video không được vượt quá 100MB!");
            this.value = ""; // Xóa giá trị file
            return;
        }

        // Hiển thị video xem trước
        const videoSrc = URL.createObjectURL(file);
        $("#video_intro_src").attr("src", videoSrc); // Gán URL mới vào video
        $("#video_intro_preview").show(); // Hiển thị video
        $("#video_placeholder").hide(); // Ẩn placeholder (nếu có)
        $("#video_intro_preview")[0].load(); // Load lại video để đảm bảo hiển thị

        // Cập nhật tên file trong label
        $("label[for='video_intro_file']").text(file.name);
    }
});

//function loadSubCategories() {
//    debugger
//    const mainCategoryId = $("#mainCategory").val();
//    const subCategorySelect = $("#subCategory");

//    // Reset danh mục phụ
//    subCategorySelect.empty().append("<option value=''>Chọn danh mục phụ</option>");

//    if (!mainCategoryId) {
//        return;
//    }

//    $.ajax({
//        url: `/Courses/GetSubCategories?mainCategoryId=${mainCategoryId}`,
//        type: "GET",
//        success: function (data) {
//            debugger
//            if (data && data.length > 0) {
//                data.forEach(category => {
//                    subCategorySelect.append(
//                        `<option value="${category.id}">${category.name}</option>`
//                    );
//                });
//            }
//        },
//        error: function (xhr, status, error) {
//            console.error("Lỗi khi tải danh mục phụ:", error);
//            console.log("Chi tiết lỗi:", xhr.responseText); // Log nội dung trả về từ server
//            console.log("Trạng thái HTTP:", xhr.status);  // Log mã HTTP status
//            alert("Không thể tải danh mục phụ.");
//        }
//    });
//};


$('#parent-category').change(function () {
    debugger
    const parentId = $(this).val();
    const childSelect = $('#child-category');
    childSelect.empty();
    childSelect.append('<option value="">-- Chọn chủ đề con --</option>');

    if (parentId) {
        $.ajax({
            url: '/Courses/GetSubCategories',
            type: 'GET',
            data: { parentId },
            success: function (data) {
                debugger
                data.forEach(item => {
                    childSelect.append(`<option value="${item.id}">${item.name}</option>`);
                });
            },
            error: function () {
                alert('Không thể tải danh sách chủ đề con.');
            }
        });
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

        // Nếu không có video mới, sử dụng video hiện tại (video cũ)
        if (!videoFile) {
            const currentVideoPath = $("#video_intro_src").attr("src");
            if (currentVideoPath) {
                formData.append("CurrentVideoPath", currentVideoPath); // Lưu đường dẫn video hiện tại
            }
        } else {
            formData.append("VideoIntro", videoFile); // Lưu video mới
        }
        let formvalid = $('#form-news');
        var max_pos = $('#ArticleType:checked').val() == "0" ? 7 : 8;
        formvalid.validate({
            rules: {
                Title: {
                    required: true,
                    maxlength: 300
                },
                Description: {
                    required: true,
                    maxlength: 400
                },
                Position: {
                    min: 0,
                    max: max_pos
                },
                MainCategoryId: {
                    required: true,
                },
            },
            messages: {
                Title:
                {
                    required: "Vui lòng nhập tiêu đề cho bài viết",
                    maxlength: "Tiêu đề cho bài viết không được vượt quá 300 ký tự"
                },
                Description: {
                    required: "Vui lòng nhập mô tả ngắn cho bài viết",
                    maxlength: "Mô tả cho bài viết không được vượt quá 400 ký tự"
                },
                Position: {
                    min: "Vị trí bài viết phải trong khoảng 0 đến " + max_pos,
                    max: "Vị trí bài viết phải trong khoảng 0 đến " + max_pos
                },
                MainCategoryId: {
                    required: "Vui lòng chọn danh mục chính",
                },
            }
        });

        if (formvalid.valid()) {
            var _body = tinymce.activeEditor.getContent();
            var _tags = $('#news-tag').tagsinput('items');
            //var _categories = [];
            var _relatedCourseTagIds = [];

            //if ($('.ckb-news-cate:checked').length > 0) {
            //    $('.ckb-news-cate:checked').each(function () {
            //        _categories.push($(this).val());
            //    });
            //}

            if ($('.item-related-article').length > 0) {
                $('.item-related-article').each(function () {
                    _relatedCourseTagIds.push(parseFloat($(this).data('id')));
                });
            }

            //if (_categories.length <= 0) {
            //    _msgalert.error('Bạn phải chọn chuyên mục cho bài viết');
            //    return false;
            //}
            if ($('#Description').val().length >= 400) {
                _msgalert.error('Mô tả cho bài viết không được vượt quá 400 ký tự');
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
                // Price: $('#price-input').val(),
                // OriginalPrice: $('#original-price-input').val(),

                Type: $('#ArticleType:checked').val(),
                //AuthorId: $('#AuthorId').val(),
                //CreatedBy: $('#CreatedBy').val(),
                CreatedDate: ConvertToJSONDateTime($('#PublishDate').val()),
                //UpdatedBy: $('#UpdatedBy').val(),
                //UpdatedDate: $('#UpdatedDate').val(),
                Tags: _tags,
                Categories: [$('#parent-category').val(), $('#child-category').val()],
                //MainCategoryId: $('#mainCategory').val(),
                //SubCategoryId: $('#subCategory').val() || null,
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

                    if (result.isSuccess) {
                        /* _msgalert.success(result.message);*/
                        $('#Id').val(result.dataId); // Gán lại ID khóa học
                        // Kiểm tra nếu là lưu để chuyển sang Tiết Học

                        // Hiển thị video thành công từ server
                        if (result.videoPath) {
                            $("#video_intro_src").attr("src", result.videoPath);
                            $("#video_intro_preview").show();
                        }
                        Swal.fire("Thành công", result.message, "success").then(() => {

                            window.location.href = `/courses/detail/${result.dataId}`;

                        });



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