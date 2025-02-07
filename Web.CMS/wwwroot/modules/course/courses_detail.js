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

//_common.tinyMce('#text-editor-chapter');


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
function sendRequest(url, data, successMessage, reloadCallback) {
    debugger
    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
            if (response.isSuccess) {
                Swal.fire("Thành công", successMessage, "success").then(() => {
                    if (reloadCallback) reloadCallback();
                });
            } else {
                Swal.fire("Lỗi", response.message, "error");
            }
        },
        error: function () {
            Swal.fire("Lỗi", "Đã xảy ra lỗi trong quá trình xử lý!", "error");
        },
    });
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

    // 👉 **Khôi phục các bài giảng trước đó về trạng thái bình thường**
    $(".box-add-chap").each(function () {
        let lessonContainer = $(this);
        if (!lessonContainer.is(container)) {
            lessonContainer.find(".item-content").empty(); // Xóa form sửa
            lessonContainer.find(".lesson-header, .title-block").show(); // Hiển thị lại tiêu đề
        }
    });
    
    // Ẩn tiêu đề gốc nếu đang sửa
    if ($(this).hasClass("btn-edit-item")) {
        container.find(".item-header, .title-block").first().hide();
    }
    // Ẩn nút khi nhấn vào (Chỉ áp dụng khi thêm mới, không áp dụng cho sửa)
    if (!$(this).hasClass("btn-edit-item")) {
        $(this).hide();
    }
    
    $(".common-panel").hide();
    $(".lesquiz").hide();




    // Mở form
    openItemForm(container, type, title, id, parentId);
});
function openItemForm(container, type, title, id = 0, parentId = 0, additionalData = {}) {
    debugger;
    const placeholderText = type === "Chapter" ? "Vui lòng nhập tên phần" : "Vui lòng nhập tên bài học";
    const headerText = type === "Chapter" ? "Phần chưa xuất bản" : "Bài Học chưa xuất bản";
    const actionText = id === 0 ? "Thêm" : "Lưu";

    // Nội dung form
    const formHtml = `
        <div class="box-add-chap box_2" ${type !== "Chapter" && id > 0 ? 'style="margin-left:0; border: none;"' : ''}>
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


    if (type === "Chapter") {
        if (id === 0) {
            // Nếu thêm mới Chapter, thêm vào cuối danh sách
            container.append(`<div class="block-chap">${formHtml}</div>`);
        } else {
            // Nếu sửa Chapter, thay thế nội dung ngay tại vị trí hiện tại
            container.find("> .item-content").html(formHtml).show();
        }
    } else {
        // Với Lesson/Quiz, luôn chèn vào cuối container hiện tại
        //container.append(formHtml);
        if (id === 0) {
            container.append(formHtml); // **Thêm mới Lesson xuống dưới**
        } else {
            container.find("> .item-content").append(formHtml).show(); // **Thêm vào dưới**
        }
    }
    $(".item-title").focus().on("input", function () {
        const charCount = $(this).val().length;
        $(this).siblings(".character-count").text(`${charCount}/200`);
    });
    
}



$(document).on("click", ".btn-save-item", function () {
     debugger
    const $this = $(this);
    const type = $this.data("item-type");
    const id = $this.data("item-id") || 0;
    const parentId = $this.data("parent-id") || 0;
    const courseId = $("#Id").val();
    const title = $this.closest(type === "Chapter" ? ".block-chap" : ".box-add-chap").find("input.item-title").val().trim();

    if (!title) {
        Swal.fire("Lỗi", "Vui lòng nhập tên!", "error");
        return;
    }

    const item = { Id: id, Title: title, Type: type, ParentId: parentId, CourseId: courseId };
    sendRequest("/Courses/AddorUpdateItem", item, "Thao tác thành công!", () => loadChapters(courseId));
    
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
            debugger
           sendRequest("/Courses/DeleteItem", { id, type }, "Xóa thành công!", () => $(`[data-item-id="${id}"][data-item-type="${type}"]`).remove());
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
        $(".btn-add-type[data-type='Chapter']").show();
        $(".btn-add-content").show();
        $(".content-options").show();

    } else {
        // Nếu là sửa Chapter
        const chapterId = $(this).closest(".block-chap").data("chapter-id");
        loadChapters($("#Id").val()); // Tải lại danh sách chapters để phục hồi trạng thái ban đầu
    }
});

//Lession


//$(document).on("change", ".custom-file-input", function () {
//    var fileName = $(this).val().split("\\").pop(); // Lấy tên file
//    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
//});

// Hiển thị các nút "Bài giảng" và "Trắc nghiệm"
$(document).on("click", ".btn-add-content", function () {
    const parent = $(this).closest(".box-add-chap");
    const options = parent.find(".content-options");
    // Ẩn nút khi nhấn vào (Chỉ áp dụng khi thêm mới, không áp dụng cho sửa)
    
        $(this).hide();
    

    // Ẩn tất cả các content-options khác
    $(".content-options").not(options).hide();

    // Hiển thị hoặc ẩn tùy chọn của mục hiện tại
    options.toggle();
});



// Mở/Đóng lesson-content-wrapper khi nhấn nút Chevron
function toggleContent(lessonId) {
    const lesson = document.getElementById(lessonId);
    if (!lesson) {
        console.error(`Lesson with id "${lessonId}" not found`);
        return;
    }

    const wrapper = lesson.querySelector(".lesson-content-wrapper");
    const chevron = lesson.querySelector(".btn-chevron i");

    // Toggle hiển thị lesson-content-wrapper
    if (wrapper.style.display === "none" || wrapper.style.display === "") {
        wrapper.style.display = "block"; // Hiển thị wrapper
        chevron.classList.remove("icofont-rounded-down");
        chevron.classList.add("icofont-rounded-up");
    } else {
        wrapper.style.display = "none"; // Ẩn wrapper
        chevron.classList.remove("icofont-rounded-up");
        chevron.classList.add("icofont-rounded-down");
    }
}


// Khi nhấn "Nội dung"
$(document).on("click", ".btn-toggle-content", function () {
    const lessonBlock = $(this).closest(".lesson-block");
    const wrapper = lessonBlock.find(".lesson-content-wrapper");
    const commonPanel = wrapper.find(".common-panel");

    // Ẩn panel mặc định (Mô tả và Tài nguyên)
    wrapper.find(".panel-default").hide();

    // Hiển thị panel Nội dung và cập nhật tiêu đề động
    commonPanel.attr("data-current-panel", "content");
    wrapper.find(".panel-content").show();
    wrapper.find(".dynamic-title").text("Chọn loại nội dung");

    // Đảm bảo khu vực lesson-content-wrapper hiển thị
    wrapper.show();
});

$(document).on("click", ".btn-file", function (e) {
    e.preventDefault(); // Ngăn chặn hành vi mặc định

    const type = $(this).data("type"); // Lấy giá trị data-type (video/article)
    const itemId = $(this).data("item-id"); // Lấy ID bài giảng
    const wrapper = $(this).closest(".panel-content").parent(); // Tìm phần tử cha chứa các panel

    // Ẩn tất cả các panel trước khi hiển thị panel cần chọn
    wrapper.find(".panel-content, .panel-upload-video, .panel-upload-article").hide();

    // Hiển thị panel tương ứng dựa vào loại nội dung được chọn
    if (type === "video") {
        wrapper.find(".panel-upload-video").show();
        wrapper.find(".dynamic-title").text("Chọn loại Video");
    } else if (type === "article") {

        wrapper.find(".panel-upload-article").show();
        wrapper.find(".dynamic-title").text("Văn Bản");
        // Chờ panel mở xong rồi khởi tạo TinyMCE
        setTimeout(function () {
            const textareaId = `#text-editor-chapter-${itemId}`;

            if ($(textareaId).length > 0) {
                tinymce.remove(textareaId); // Xóa TinyMCE cũ
                _common.tinyMce(textareaId, 200); // Khởi tạo TinyMCE mới
            }
        }, 100);
    }
});


// Khi nhấn vào dấu "X" trong bất kỳ panel nào
$(document).on("click", ".btn-close-content", function () {
    const wrapper = $(this).closest(".lesson-content-wrapper");
    const commonPanel = wrapper.find(".common-panel");
    $(this).closest(" .panel-upload-article, .panel-content").hide();
    // Ẩn tất cả các panel
    wrapper.find(".panel-content, .panel-upload-video").hide();

    // Hiển thị panel mặc định và cập nhật tiêu đề động
    commonPanel.attr("data-current-panel", "default");
    wrapper.find(".panel-default").show();
    wrapper.find(".dynamic-title").text("Chọn loại nội dung");
});

//$(document).on("click", ".btn-replace-video", function () {
//    const lessonId = $(this).data("lesson-id");
//    const wrapper = $(`#lesson_${lessonId}`).find(".lesson-content-wrapper");

//    // ✅ Reset input file để tránh dính dữ liệu cũ
//    const fileInput = wrapper.find(".panel-upload-video .custom-file-input");
//    fileInput.val("");
//    fileInput.next(".custom-file-label").text("Không có file nào được chọn");

//    // ✅ Ẩn panel mặc định và nội dung
//    wrapper.find(".panel-default, .panel-content").hide();

//    // ✅ Hiển thị Panel Upload Video, nhưng không làm ảnh hưởng đến tài nguyên
//    wrapper.find(".panel-upload-video").attr("data-type", "video").show();
//    wrapper.find(".dynamic-title").text("Thay thế Video");

//    // ✅ Reset lại danh sách tài nguyên nếu là thay thế video
//    if (wrapper.find(".panel-upload-video").attr("data-type") === "video") {
//        $(`#downloadList_${lessonId}`).html(""); // Xóa danh sách tài nguyên
//    }
//});

 //Khi nhấn "Thay thế Video" hoặc "Thêm Tài Nguyên"
$(document).on("click", ".btn-resource", function () {
    debugger
    const lessonId = $(this).data("lesson-id");
    const type = $(this).hasClass("btn-replace-video") ? "video" : "resource";

    if (!lessonId) {
        console.error("🔴 Lỗi: lessonId bị undefined");
        return;
    }

    // Ẩn panel mặc định, mở panel upload
    $(`#lesson_${lessonId} .panel-default`).hide();
    $(`#lesson_${lessonId} .panel-content`).hide();
    $(`#lesson_${lessonId} .panel-upload-video`).attr("data-type", type).show();
    $(`#lesson_${lessonId} .dynamic-title`).text(type === "video" ? "Thay thế Video" : "Thêm Tài Nguyên");
});


$(document).on("click", ".btn-replace-video", function () {
    const lessonId = $(this).data("lesson-id");
    const wrapper = $(`#lesson_${lessonId}`).find(".lesson-content-wrapper");

    // ✅ Reset input file để tránh lỗi upload file cũ
    const fileInput = wrapper.find(".panel-upload-video .custom-file-input");
    fileInput.val("");
    fileInput.next(".custom-file-label").text("Không có file nào được chọn");

    // ✅ Đảm bảo cập nhật `data-type="video"` khi nhấn "Thay thế Video"
    wrapper.find(".panel-upload-video").attr("data-type", "video");

    // ✅ Chắc chắn không reset danh sách tài nguyên khi thay video
    wrapper.find(".panel-default, .panel-content").hide();
    wrapper.find(".panel-upload-video").show();
    wrapper.find(".dynamic-title").text("Thay thế Video");
});


// Xử lý Upload file (Tài nguyên hoặc Video)
$(document).on("change", ".custom-file-input.auto-upload", function () {
    debugger;
    const input = $(this);
    const files = this.files;
    const lessonId = input.data("lesson-id");

    if (files.length === 0 || !lessonId) return alert("Lỗi: Không tìm thấy Lesson ID");

    const type = $(`#lesson_${lessonId} .panel-upload-video`).attr("data-type"); // ✅ Lấy type đúng
    const isReplace = type === "video";
    const isResource = type === "resource";

    // ✅ Kiểm tra đúng loại file trước khi upload
    if (isReplace && !isValidVideoFile(files)) {
        alert("❌ Chỉ được upload file Video (.mp4, .avi, .mov)!");
        resetFileInput(input);
        return;
    }

    // ✅ Hiển thị file name
    const fileName = files.length === 1 ? files[0].name : `${files.length} files selected`;
    input.next(".custom-file-label").text(fileName);

    // ✅ Chuẩn bị dữ liệu upload
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }
    formData.append("lessonId", lessonId);
    formData.append("isReplace", isReplace);
    formData.append("isResource", isResource);

    $.ajax({
        url: "/Courses/UploadFile",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.isSuccess && response.data.length > 0) {
                updateLessonUI(lessonId, response.data, isResource);
            } else {
                alert(response.message || "Upload không thành công.");
            }
        },
        error: function () {
            alert("Có lỗi xảy ra khi tải file lên. Vui lòng thử lại!");
        },
    });
});

// Xử lý sự kiện click nút xóa file
$(document).on("click", ".btn-delete-file", function () {
    debugger
    const fileId = $(this).data("file-id");
    const lessonId = $(this).data("lesson-id");

    Swal.fire({
        title: "Bạn có chắc muốn xóa tài nguyên này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "/Courses/DeleteResource",
                type: "POST",
                data: { fileId: fileId, lessonId: lessonId },
                success: function (response) {
                    if (response.isSuccess) {
                        // Xóa phần tử file khỏi danh sách
                        $(`#file_${fileId}`).fadeOut("slow", function () {
                            $(this).remove();

                            // Kiểm tra nếu không còn file nào
                            const fileList = $(`#downloadList_${lessonId}`);
                            //if (fileList.children("li").length === 0) {
                            //    fileList.html('<li class="text-muted">Chưa có tài liệu nào</li>');
                            //}
                        });

                        // Hiển thị thông báo thành công
                        Swal.fire({
                            title: "Thành công!",
                            text: "Xóa tài nguyên thành công",
                            icon: "success",
                            timer: 1500
                        });
                    } else {
                        // Hiển thị thông báo lỗi
                        Swal.fire({
                            title: "Lỗi!",
                            text: response.message || "Xóa tài nguyên không thành công",
                            icon: "error"
                        });
                    }
                },
                error: function () {
                    // Hiển thị thông báo lỗi khi gọi API thất bại
                    Swal.fire({
                        title: "Lỗi!",
                        text: "Có lỗi xảy ra khi xóa tài nguyên. Vui lòng thử lại!",
                        icon: "error"
                    });
                }
            });
        }
    });
});

/** Hàm kiểm tra định dạng file Video hợp lệ */
function isValidVideoFile(files) {
    const allowedExtensions = ["mp4", "avi", "mov"];
    return Array.from(files).every(file => {
        const ext = file.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(ext);
    });
}
/** Hàm reset input file khi chọn file không hợp lệ */
function resetFileInput(input) {
    input.val("");  // Reset giá trị file input
    input.next(".custom-file-label").text("Không có file nào được chọn"); // Đặt lại tên file hiển thị
}


// Hàm cập nhật giao diện sau khi upload thành công
function updateLessonUI(lessonId, files, isResource) {
    debugger
    $(`#lesson_${lessonId} .panel-upload-video, #lesson_${lessonId} .btn-toggle-content`).hide();
    $(`#lesson_${lessonId} .panel-default`).fadeIn("slow");

    // ✅ Gọi showUploadProgress cho cả tài nguyên và video
    showUploadProgress(lessonId, files, isResource);
}


// Hiển thị trạng thái "Đang tải lên..." trong danh sách file
function showUploadProgress(lessonId, files, isResource) {
    debugger;
    const container = isResource ? `#downloadList_${lessonId}` : `#fileList_${lessonId}`;
    const fileList = $(container);

    // ✅ Khi upload video -> Ẩn tài nguyên
    if (!isResource) {
        $(`#boxTailieu_${lessonId}`).hide();
    }

    // ✅ Ẩn nút "Tài nguyên"
    $(`.btn-resource[data-lesson-id="${lessonId}"]`).hide();

    // ✅ Xóa danh sách cũ (chỉ khi upload video)
    if (!isResource) {
        fileList.empty();
    }

    // ✅ Hiển thị process upload
    files.forEach((file, index) => {
        const fileId = `uploadingRow_${lessonId}_${index}`;
        fileList.append(createUploadingRow(fileId, file, isResource));
    });

    fileList.show();
    simulateUploadProgress(lessonId, files, isResource);
}





// Tạo hàng đang upload
function createUploadingRow(fileId, file, isResource) {
    if (isResource) {
        return `
            <tr id="${fileId}">
                <td>
                    <a href="javascript:void(0)">
                        <i class="icofont-download"></i> ${file.path ? file.path.split('/').pop() : 'Đang tải...'}
                    </a>
                </td>
                <td class="text-right">
                    <span class="progress-text" id="progress-text-${fileId}">0%</span>
                    <div class="progress-container">
                        <div class="progress-bar" id="progress-bar-${fileId}" style="width: 0%"></div>
                    </div>
                </td>
                
            </tr>
        `;
    } else {
        return `
            <tr id="${fileId}">
                <td>${file.path ? file.path.split('/').pop() : 'Đang tải...'}</td>
                <td>${file.ext || '...'}</td>
                <td>
                    <span class="progress-text" id="progress-text-${fileId}">0%</span>
                    <div class="progress-container">
                        <div class="progress-bar" id="progress-bar-${fileId}" style="width: 0%"></div>
                    </div>
                </td>
                <td>Đang tải...</td>
            </tr>
        `;
    }
}



// Giả lập cập nhật tiến trình upload
function simulateUploadProgress(lessonId, files, isResource) {
    debugger;
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        files.forEach((file, index) => {
            const fileId = `uploadingRow_${lessonId}_${index}`;
            $(`#progress-bar-${fileId}`).css("width", `${progress}%`);
            $(`#progress-text-${fileId}`).text(`${progress}%`);
        });

        if (progress >= 100) {
            clearInterval(interval);

            setTimeout(() => {
                // ✅ Xóa process ngay lập tức khi hoàn tất
                files.forEach((file, index) => {
                    const fileId = `uploadingRow_${lessonId}_${index}`;
                    $(`#${fileId}`).remove();

                    // ✅ Khi xóa xong, cập nhật danh sách
                    if (index === files.length - 1) {
                        if (isResource) {
                            updateResourceList(lessonId, files);
                        } else {
                            renderFileList(lessonId, files);
                        }
                    }
                });

                // ✅ Chỉ hiển thị lại "Tài nguyên" ngay lập tức khi tải xong Video
                if (!isResource) {
                    $(`#boxTailieu_${lessonId}`).show();
                }

                // ✅ Hiển thị ngay lập tức nút "Tài nguyên"
                $(`.btn-resource[data-lesson-id="${lessonId}"]`).show();

            }, 500);
        }
    }, 500);
}





// Cập nhật danh sách tài nguyên sau khi tải lên
function updateResourceList(lessonId, files) {
    debugger;
    const list = $(`#downloadList_${lessonId}`);
    const boxTailieu = $(`#boxTailieu_${lessonId}`); // ✅ Box tài nguyên

    // ✅ Lấy danh sách file hiện có
    let existingFiles = list.children("tr").map(function () {
        return {
            id: $(this).attr("id"),
            name: $(this).find("td a").text().trim(),
            html: $(this).prop("outerHTML")
        };
    }).get();

    files.forEach(file => {
        const fileName = file.path.split('/').pop();

        // ✅ Kiểm tra nếu file trùng tên -> Không thêm vào danh sách
        if (existingFiles.some(f => f.name === fileName)) {
            console.log(`🚨 Bỏ qua file trùng: ${fileName}`);
            return;
        }

        // ✅ Nếu không trùng tên, thêm file vào danh sách hiển thị
        existingFiles.push({
            id: `file_${file.id}`,
            name: fileName,
            html: `
                <tr id="file_${file.id}">
                    <td>
                        <a href="${file.path}" target="_blank">
                            <i class="icofont-download"></i> ${file.path.split('/').pop()}
                        </a>
                    </td>
                    <td class="text-right">
                        <i class="icofont-trash btn-delete-file" data-file-id="${file.id}" data-lesson-id="${lessonId}" style="cursor:pointer;"></i>
                    </td>
                </tr>
            `
        });
    });

    // ✅ Cập nhật danh sách hiển thị
    list.html(existingFiles.map(f => f.html).join(""));

    // ✅ Kiểm tra nếu có tài nguyên thì hiển thị box tài liệu
    if (existingFiles.length === 0) {
        console.log("📢 Không có tài nguyên, ẩn box tài liệu!");
        boxTailieu.hide();
    } else {
        console.log("📢 Có tài nguyên, hiển thị box tài liệu!");
        boxTailieu.show();
    }
}


function createResourceRow(lessonId, file) {
    return `
        <tr id="file_${file.id}">
            <td>
                <a href="${file.path}" target="_blank">
                    <i class="icofont-download"></i> ${file.path.split('/').pop()}
                </a>
            </td>
            <td class="text-right">
                <i class="icofont-trash btn-delete-file" data-file-id="${file.id}" data-lesson-id="${lessonId}" style="cursor:pointer;"></i>
            </td>
        </tr>
    `;
}




// Render danh sách file sau khi hoàn tất tải lên
function renderFileList(lessonId, files) {
    const fileList = $(`#fileList_${lessonId}`);
    const table = fileList.closest("table");

    // Xóa danh sách cũ
    fileList.empty();

    // ✅ Kiểm tra nếu chưa có `thead` thì thêm vào
    if (table.find("thead").length === 0) {
        table.prepend(createTableHeader());
    }

    // ✅ Nếu không có file nào thì hiển thị hàng "Chưa có file"
    if (files.length === 0) {
        fileList.append("<tr><td colspan='5' class='text-center'>Chưa có file nào</td></tr>");
        return;
    }

    // ✅ Thêm file mới vào danh sách
    files.forEach((file) => {
        fileList.append(createFileRow(lessonId, file));
    });

    // ✅ Hiển thị danh sách video
    fileList.fadeIn("slow");
    $(`#boxTailieu_${lessonId}`).fadeIn("slow");
}


// Tạo header cho bảng
function createTableHeader() {
    return `
        <thead class="thead1">
            <tr>
                <th>Tên file</th>
                <th>Loại</th>
                <th>Trạng Thái</th>
                <th>Ngày</th>
                <th>Hành động</th>
            </tr>
        </thead>
    `;
}

// Tạo hàng file
function createFileRow(lessonId, file) {
    return `
        <tr>
            <td><a href="${file.path}" target="_blank">${file.path.split('/').pop()}</a></td>
            <td>${file.ext}</td>
            <td><span class="progress-text">Hoàn thành</span></td>
            <td>${new Date(file.createDate).toLocaleString()}</td>
            <td>
                <a href="javascript:void(0)" class="btn btn-primary btn-replace-video" data-lesson-id="${lessonId}">
                    Thay thế
                </a>
            </td>
        </tr>
    `;
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






//$(document).on("click", "#save-chapters1", function () {
//    debugger
//    const block = $(this).closest(".box-add-chap"); // Giới hạn phạm vi tìm kiếm
//    const title = block.find(".chapter-title").val().trim();
//    const chapterId = $(this).data("chapter-id") || 0;
//    const courseId = $("#Id").val();
//    let isValid = true;
//    if (!title) {
//        Swal.fire("Lỗi", "Vui lòng nhập tên phần!", "error");
//        isValid = false;
//        return false;
//    }



//    const chapters = {
//        Id: chapterId,
//        Title: title,
//        CourseId: courseId,
//    };

//    // Gọi API tạo chapter mới
//    $.ajax({
//        url: "/Courses/AddorUpdateItem",
//        type: "POST",
//        contentType: "application/json",
//        data: JSON.stringify(chapters),

//        success: function (response) {
//            debugger
//            if (response.isSuccess) {
//                Swal.fire("Thành công", "Thêm phần mới thành công!", "success").then(() => {~~
//                    loadChapters(courseId); // Reload lại danh sách chapters
//                });
//            } else {
//                Swal.fire("Lỗi", response.message, "error");
//            }
//        },
//        error: function () {
//            Swal.fire("Lỗi", "Đã xảy ra lỗi khi thêm phần mới!", "error");
//        }
//    });
//});
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