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
    

});
_common.tinyMce('#text-editor');
//===========================================================================================

_common.tinyMce('#text-editor-quiz');


// 1️. Khi load trang, kiểm tra tab đã lưu trong localStorage
let currentTab = localStorage.getItem("currentTab");

// Nếu không có tab nào được lưu, mặc định là 'course-info'
if (!currentTab) {
    currentTab = "course-info";
}

// Ẩn tất cả các tab trước khi hiển thị tab đã lưu
$(".tab-content").hide();
$(`#${currentTab}`).show();

// Cập nhật class active trên menu tab
$(".tab-link").removeClass("active");
$(`.tab-link[data-tab='${currentTab}']`).addClass("active");

// Nếu tab là "chapters-tab", cần load dữ liệu chương học
if (currentTab === "chapters-tab") {
    const courseId = $("#Id").val();
    if (courseId && courseId > 0) {
        loadChapters(courseId);
    }
}
/// 2️. Xử lý sự kiện chuyển tab
$(document).on("click", ".tab-link", function (event) {
    event.preventDefault(); // Ngăn hành động mặc định

    const targetTab = $(this).data("tab"); // Lấy tab được chọn
    const courseId = $("#Id").val(); // Lấy ID khóa học từ input ẩn

    // Lưu tab hiện tại vào localStorage
    localStorage.setItem("currentTab", targetTab);

    // Nếu tab là "chapters-tab" mà khóa học chưa được lưu, cảnh báo
    if (targetTab === "chapters-tab") {
        if (!courseId || courseId <= 0) {
            Swal.fire({
                title: "Bạn cần lưu khóa học để tạo chương",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Có",
                cancelButtonText: "Không",
            }).then((result) => {
                if (result.isConfirmed) {
                    _newsDetail1.OnSave('0'); // Gọi hàm lưu khóa học
                }
            });
        } else {
            // Nếu khóa học đã lưu, tải nội dung chương học
            loadChapters(courseId);
            $(".tab-content").hide(); // Ẩn tất cả các tab
            $(`#${targetTab}`).show(); // Hiển thị tab "chapters-tab"
        }
    } else {
        $(".tab-content").hide();
        $(`#${targetTab}`).show();
    }

    // Cập nhật class active trên menu tab
    $(".tab-link").removeClass("active");
    $(this).addClass("active");
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
function openItemForm(container, type, title, id = 0, parentId = 0) {

    const placeholderText = type === "Chapter" ? "Vui lòng nhập tên phần" :
        type === "Quiz" ? "Vui lòng nhập nội dung câu hỏi" :
            "Vui lòng nhập tên bài học";

    const headerText = type === "Chapter" ? "Phần chưa xuất bản" :
        type === "Quiz" ? "Câu Hỏi chưa xuất bản" :
            "Bài Học chưa xuất bản";

    const actionText = id === 0 ? "Thêm" : "Lưu";

    // **Dùng chung Form**
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
                    ${actionText} ${type === "Chapter" ? "Phần" : type === "Quiz" ? "Câu Hỏi" : "Bài Học"}
                </button>
            </div>
        </div>
    `;
    debugger

    if (type === "Chapter") {
        if (id === 0) {
            container.append(`<div class="block-chap">${formHtml}</div>`);
        } else {
            container.find("> .item-content").html(formHtml).show();
        }
    } else {
        if (id === 0) {
            if (type === "Quiz") {
                let lastQuiz = container.find(".box-add-chap[data-item-type='Quiz']").last();
                if (lastQuiz.length > 0) {
                    lastQuiz.after(formHtml); // Đẩy xuống cuối cùng của danh sách Quiz
                } else {
                    container.append(formHtml); // Nếu chưa có Quiz nào, thêm vào cuối container
                }
            } else {
                container.append(formHtml);
            }
        } else {
            container.find("> .item-content").append(formHtml).show();
        }
    }

    // Bắt sự kiện nhập và đếm số ký tự
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
    debugger;
    const id = $(this).data("item-id"); // Lấy ID của item
    const type = $(this).data("item-type"); // Lấy loại của item (Quiz, Chapter, Lesson)
    const quizBlock = $(this).closest(".lesson-block"); // Lấy block của Quiz
    const panelListQuiz = quizBlock.find(".panel-listquiz"); // Danh sách câu hỏi
    const btnToggleContent = quizBlock.find(".btn-toggle-content"); // Nút "Câu hỏi"
    const btnChevron = quizBlock.find(".btn-chevron"); // Nút chevron
    const commonPanel = quizBlock.find(".common-panel1"); // Panel nội dung chung

    Swal.fire({
        title: `Bạn có chắc muốn xóa ${type === "Chapter" ? "Phần" : type === "Lesson" ? "Bài Học" : "Câu Hỏi"} này?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
    }).then((result) => {
        if (result.isConfirmed) {
            sendRequest("/Courses/DeleteItem", { id, type }, "Xóa thành công!", function () {
                if (type === "Chapter" || type === "Lesson") {
                    // ✅ Xóa trực tiếp item trên giao diện
                    $(`[data-item-id="${id}"][data-item-type="${type}"]`).remove();
                    // ✅ Cập nhật lại số thứ tự của Chapters & Lessons
                    updateNumbers();
                } else if (type === "Quiz") {
                    // ✅ Xóa toàn bộ phần tử câu hỏi khỏi giao diện
                    let questionElement = $(`[data-question-id="${id}"]`);
                    $(`[data-item-id="${id}"][data-item-type="${type}"]`).remove();

                    if (questionElement.length > 0) {
                        questionElement.remove();
                    }

                    //// ✅ Kiểm tra nếu danh sách câu hỏi rỗng, ẩn luôn .panel-listquiz
                    //if (panelListQuiz.find(".question-content").length === 0) {
                    //    panelListQuiz.hide(); // Ẩn danh sách câu hỏi
                    //    btnToggleContent.show(); // Hiển thị lại nút "Câu hỏi"
                    //    btnChevron.hide(); // Ẩn nút chevron

                    //}
                }
            });
        }
    });
});



// 🔄 Hàm cập nhật số thứ tự (bài giảng liên tục trên toàn bộ hệ thống)
function updateNumbers() {
    let chapterIndex = 1;
    let lessonIndex = 1; // Bài giảng sẽ liên tục trên toàn hệ thống

    // Cập nhật số thứ tự của các Chapters
    $(".block-chap").each(function () {
        $(this).find(".tt-phan").text(`Phần ${chapterIndex}:`); // Cập nhật tiêu đề Phần
        chapterIndex++;

        // Cập nhật số thứ tự của các Lessons (nối tiếp trên toàn hệ thống)
        $(this).find(".lesson-info .text-nowrap").each(function () {
            $(this).text(`Bài giảng ${lessonIndex}:`);
            lessonIndex++; // Luôn tăng liên tục trên toàn hệ thống
        });
    });
}




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

//Quizz


// Khi nhấn "Thêm đáp án"
$(document).on("click", ".btn-add-answer", function (e) {
    debugger
    e.preventDefault();

    const quizId = $(this).data("quiz-id"); // Lấy Quiz ID
    const answerList = $(this).closest(".panel-quiz").find(".answer-list"); // Khu vực chứa đáp án
    const newAnswerId = `text-editor-answer-${quizId}-${Date.now()}`; // Tạo ID duy nhất

    // ✅ Tạo HTML cho textarea đáp án mới
    const newAnswerHtml = `
        <div class="row mt-3 answer-item" data-answer-id="0">
            <div class="col-2">
                <label class="radio">
                    <input type="radio" name="isCorrectAnswer-${quizId}" value="${newAnswerId}">
                    <span class="checkmark"></span>
                </label>
            </div>
            <div class="col-8">
                <div>
                    <textarea rows="3" class="form-control text-editor-answer" id="${newAnswerId}" placeholder="Nhập câu trả lời..."></textarea>
                    <div class="custom-input mb-2 w-100 pl-5 mt-2">
                        <input type="text" class="form-control answer-note" placeholder="Giải thích lý do đây là hoặc không phải là đáp án hay nhất" />
                        <label class="custom-label">100</label>
                    </div>
                </div>
            </div>
            <div class="col-2">
                <i class="icofont-trash btn-remove-answer" style="cursor: pointer;"></i>
            </div>
        </div>`;

    // ✅ Thêm đáp án mới vào danh sách
    answerList.append(newAnswerHtml);

    // ✅ Đợi textarea render trước khi khởi tạo TinyMCE
    setTimeout(() => {
        if ($(`#${newAnswerId}`).length > 0) {
            tinymce.init({
                selector: `#${newAnswerId}`,
                height: 130,
                menubar: false,
                plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                imagetools_cors_hosts: ['picsum.photos']
            });
        }
    }, 100);
});





function showQuizPanel(quizId, chapterId = 0) {
    debugger
    let quizBlock = $(`#quiz_${quizId}`);
    let panelQuiz = quizBlock.find(".panel-quiz");

    if (panelQuiz.length === 0) {
        console.warn(`⚠️ Không tìm thấy .panel-quiz của quiz ${quizId}, thêm mới vào DOM...`);
        let panelQuizHtml = `
            <div class="panel-quiz" style="display: none;" data-quiz-id="${quizId}">
                <div class="content-header">
                    <h6 class="mt-3">Đặt câu hỏi</h6>
                    <a href="javascript:void(0)" class="btn-close-content">
                        <i class="icofont-close"></i>
                    </a>
                </div>
                <textarea rows="5" class="form-control text-editor-quiz" id="text-editor-quiz-${quizId}" placeholder="Nhập câu hỏi..."></textarea>
                
                <h6 class="mt-3">Đáp án</h6>
                <div class="answer-list" id="quiz-answers-${quizId}"></div>

                <!-- ✅ Nút thêm đáp án -->
                <div class="flex justify-content-between my-3">
                    <p>Viết tối đa 15 đáp án khả thi và chọn đáp án đúng.</p>
                    <a href="javascript:void(0)" class="btn btn-default white btn-add-answer" data-quiz-id="${quizId}">
                        <i class="icofont-plus mr-2"></i> Thêm đáp án
                    </a>
                </div>

                <!-- ✅ Nút lưu -->
                <div class="text-right">
                    <a href="javascript:void(0)" class="btn btn-default btn-save-quiz" data-parent-id="${chapterId}" data-quiz-id="${quizId}" data-question-id="0"">Lưu</a>
                </div>
            </div>
        `;
        quizBlock.append(panelQuizHtml);
        panelQuiz = quizBlock.find(".panel-quiz");
    }
    // ✅ Reset questionId về 0 khi nhấn "Câu hỏi mới"
    panelQuiz.find(".btn-save-quiz").data("question-id", 0);

    // ✅ XÓA DỮ LIỆU CŨ TRƯỚC KHI HIỂN THỊ FORM MỚI
    const quizTextAreaId = `#text-editor-quiz-${quizId}`;

    // 👉 Xóa TinyMCE hoàn toàn trước khi reset dữ liệu
    if (tinymce.get(`text-editor-quiz-${quizId}`)) {
        tinymce.get(`text-editor-quiz-${quizId}`).setContent(''); // Reset nội dung trong TinyMCE
        tinymce.remove(quizTextAreaId); // Xóa TinyMCE trước khi khởi tạo lại
    }

    panelQuiz.find(".answer-list").html(generateDefaultAnswers(quizId)); // Reset danh sách đáp án

    // ✅ Reset tất cả radio button (Không chọn đáp án nào)
    panelQuiz.find('input[type="radio"]').prop("checked", false);

    // ✅ Ẩn danh sách câu hỏi nếu có
    quizBlock.find(".panel-listquiz").hide();

    // ✅ Hiển thị panel
    panelQuiz.show();
    panelQuiz.find(".text-editor-quiz").focus();

    // ✅ Chờ 300ms để đảm bảo textarea có trong DOM trước khi khởi tạo TinyMCE
    setTimeout(() => {

        const quizTextAreaId = `#text-editor-quiz-${quizId}`;

        if ($(quizTextAreaId).length > 0) {
            tinymce.remove(quizTextAreaId);
            _common.tinyMce(quizTextAreaId, 200);
        }

        // ✅ Khởi tạo TinyMCE cho các đáp án
        panelQuiz.find(".text-editor-answer").each(function () {
            const answerId = `#${$(this).attr("id")}`;
            tinymce.remove(answerId);
            tinymce.init({
                selector: answerId,
                height: 130,
                menubar: false,
                plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                imagetools_cors_hosts: ['picsum.photos']
            });
        });

    }, 300);

    return panelQuiz;
}

function generateDefaultAnswers(quizId) {
    let answerHtml = '';
    for (let i = 1; i <= 3; i++) {
        answerHtml += `
            <div class="row mt-3 answer-item">
                <div class="col-2">
                    <label class="radio">
                        <input type="radio" name="isCorrectAnswer-${quizId}" value="${i}">
                        <span class="checkmark"></span>
                    </label>
                </div>
                <div class="col-8">
                    <div>
                        <textarea rows="3" class="form-control text-editor-answer" id="text-editor-answer-${quizId}-${i}" placeholder="Nhập Trả lời..."></textarea>
                        <div class="custom-input mb-2 w-100 pl-5 mt-2">
                            <input type="text" class="form-control answer-note" placeholder="Giải thích lý do đây là hoặc không phải là đáp án hay nhất" />
                        </div>
                    </div>
                </div>
                <div class="col-2">
                    <i class="icofont-trash btn-remove-answer" style="cursor: pointer;"></i>
                </div>
            </div>
        `;
    }
    return answerHtml;
}


//Thêm Câu hỏi

$(document).on("click", ".btn-new-question", function (e) {
    debugger
    e.preventDefault();
    const quizId = $(this).data("quiz-id");
    const chapterId = $(`#quiz_${quizId}`).closest(".block-item").data("parent-id") || 0; // Lấy chapterId đúng
    quizOpened = false;

    console.log(`📌 Đang mở panel trắc nghiệm cho Quiz ID: ${quizId}`);
    showQuizPanel(quizId, chapterId);
});


let deletedAnswers = []; // Mảng lưu ID của đáp án đã xóa
// Sửa Câu Hỏi

$(document).on("click", ".btn-edit-quiz", function (e) {

    e.preventDefault();

    const quizId = $(this).data("quiz-id");
    const questionId = $(this).data("question-id");
    const chapterId = $(`#quiz_${quizId}`).closest(".block-item").data("parent-id") || 0; // Lấy chapterId đúng
    quizOpened = false;

    // Lấy panel-quiz và hiển thị nó

    const wrapper = $(this).closest(".panel-listquiz").parent();

    let panelQuiz = showQuizPanel(quizId, chapterId);

    // Ẩn danh sách câu hỏi
    wrapper.find(".panel-listquiz").hide();

    // Hiển thị panel-quiz
    panelQuiz.show();

    // Gọi API để lấy dữ liệu câu hỏi và đáp án
    $.ajax({
        url: "/Courses/GetQuizQuestion",
        type: "GET",
        data: { questionId: questionId },
        success: function (response) {
            if (response.isSuccess) {
                const { question, answers } = response.data;

                // Đảm bảo TinyMCE đã được khởi tạo
                setTimeout(() => {
                    const editorId = `text-editor-quiz-${quizId}`;

                    // Xóa TinyMCE nếu đã tồn tại
                    tinymce.remove(`#${editorId}`);

                    // Khởi tạo lại TinyMCE
                    _common.tinyMce(`#${editorId}`, 200);

                    // Chờ TinyMCE khởi tạo xong rồi mới set nội dung
                    setTimeout(() => {
                        const editor = tinymce.get(editorId);
                        if (editor) {
                            editor.setContent(question.description);
                        } else {
                            console.warn(`⚠️ Không tìm thấy TinyMCE với ID: ${editorId}`);
                        }
                    }, 200);
                }, 100);
                debugger
                // Xóa các đáp án cũ
                const answerList = $(`#quiz-answers-${quizId}`);
                answerList.empty();

                // ✅ Duy trì thứ tự của danh sách từ API
                answers.forEach((answer, index) => {
                    const answerId = `text-editor-answer-${quizId}-${index + 1}`;
                    const answerHtml = `
                        <div class="row mt-3 answer-item" data-answer-id="${answer.id}">
                            <div class="col-2">
                                <label class="radio">
                                    <input type="radio" name="isCorrectAnswer-${quizId}" value="${answer.Id}" ${answer.isCorrect ? 'checked' : ''}>
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                            <div class="col-8">
                                <div>
                                    <textarea rows="3" class="form-control text-editor-answer" id="${answerId}">${answer.description}</textarea>
                                    <div class="custom-input mb-2 w-100 pl-5 mt-2">
                                        <input type="text" class="form-control answer-note" value="${answer.note || ''}" />
                                    </div>
                                </div>
                            </div>
                            <div class="col-2">
                                <i class="icofont-trash btn-remove-answer" style="cursor: pointer;"></i>
                            </div>
                        </div>
                    `;
                    answerList.append(answerHtml);

                    // Khởi tạo TinyMCE cho textarea đáp án
                    tinymce.remove(`#${answerId}`);
                    _common.tinyMce(`#${answerId}`, 200);
                });

                // Cập nhật data-question-id cho nút lưu
                panelQuiz.find(".btn-save-quiz").data("question-id", questionId);
            } else {
                alert("Không thể lấy dữ liệu câu hỏi!");
            }
        },
        error: function () {
            alert("Đã xảy ra lỗi khi lấy dữ liệu câu hỏi!");
        }
    });
});

// Xóa Đáp án


$(document).on("click", ".btn-remove-answer", function (e) {
    debugger
    e.preventDefault();

    let answerItem = $(this).closest(".answer-item");
    let answerId = answerItem.data("answer-id"); // Lấy ID đáp án

    if (answerId && answerId !== 0) {
        // Nếu đáp án đã có trong database, thêm vào danh sách xóa
        deletedAnswers.push(answerId);
    }

    // Xóa phần tử khỏi giao diện
    answerItem.remove();

    console.log("✅ Đáp án bị xóa khỏi giao diện. Danh sách ID cần xóa trong database:", deletedAnswers);
});


//==========================================

$(document).on("click", ".btn-save-quiz", function () {
    debugger
    let quizId = $(this).data("quiz-id") || 0;
    let questionId = $(this).data("question-id") || 0;
    const parentId = $(this).data("parent-id") || 0;
    const courseId = $("#Id").val();

    // ✅ Lấy nội dung câu hỏi từ TinyMCE
    const quizDescription = tinymce.get(`text-editor-quiz-${quizId}`)?.getContent().trim() || "";
    if (!quizDescription) {
        alert("Vui lòng nhập câu hỏi!");
        return;
    }

    let answers = [];
    let isCorrectSelected = false;

    // ✅ Lấy danh sách đáp án
    $(`#quiz-answers-${quizId} .answer-item`).each(function (index) {

        let answerDataId = $(this).attr("data-answer-id") ? parseInt($(this).attr("data-answer-id")) : 0;
        const answerTextarea = $(this).find(".text-editor-answer");
        const answerId = answerTextarea.attr("id"); // ✅ Lấy ID textarea

        if (!answerId) {
            console.warn("⚠️ Không tìm thấy ID của textarea đáp án!");
            return; // ✅ Bỏ qua nếu không tìm thấy ID
        }

        // ✅ Kiểm tra nếu TinyMCE đã khởi tạo, nếu không thì lấy từ textarea gốc
        const answerText = tinymce.get(answerId)
            ? tinymce.get(answerId).getContent().trim()
            : (answerTextarea.length ? answerTextarea.val().trim() : "");

        let isCorrect = $(this).find(`input[name="isCorrectAnswer-${quizId}"]:checked`).length > 0;

        if (isCorrect) {
            isCorrectSelected = true;
        }

        let note = $(this).find(".answer-note").val()?.trim() || "";

        if (answerText) {
            answers.push({
                Id: answerDataId,
                Description: answerText,
                IsCorrect: isCorrect,
                Note: note
            });
        }
    });

    if (!isCorrectSelected) {
        alert("Bạn phải chọn ít nhất một đáp án đúng!");
        return;
    }

    if (answers.length < 2) {
        alert("Cần ít nhất 2 đáp án!");
        return;
    }

    let quizData = {
        QuizId: quizId,
        QuestionId: questionId,
        Description: quizDescription,
        ParentId: parentId,
        CourseId: courseId,
        Answers: answers,
        DeletedAnswers: deletedAnswers
    };

    $.ajax({
        url: "/Courses/SaveQuizAnswer",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(quizData),
        success: function (response) {
            debugger
            if (response.isSuccess) {
                let quizBlock = $(`#quiz_${quizId}`);
                //let questionListPanel = quizBlock.find(".panel-listquiz");
                //let questionList = questionListPanel.find(".question-list");
                let quizWrapper = quizBlock.find(".quiz-wrapper");
                let commonPanel = quizWrapper.find(".common-panel.common-quiz"); // ✅ Lấy đúng common-panel
                let panelListQuiz = commonPanel.find(".panel-listquiz");
                let questionList = panelListQuiz.find(".question-list");

                // ✅ Loại bỏ ảnh khỏi nội dung câu hỏi trước khi hiển thị
                let cleanDescription = response.description.replace(/<img[^>]*>/g, "");

                // Tìm câu hỏi cần update
                let questionElement = panelListQuiz.find(`[data-question-id="${response.questionId}"]`);

                // ✅ Nếu danh sách câu hỏi chưa có, tạo mới
                if (panelListQuiz.length === 0) {
                    commonPanel.append(`
                        <div class="panel-listquiz" id="panel-listquiz-${quizId}">
                            <div class="question-header flex-space-between">
                                <div>
                                    <span class="question-title">Câu hỏi</span>
                                    <button class="btn btn-new-question ms-2" data-quiz-id="${quizId}">Câu hỏi mới</button>
                                </div>
                                <button class="btn btn-preview">Xem trước</button>
                            </div>
                            <div class="question-list" id="question-list-${quizId}"></div>
                        </div>
                    `);
                    //questionListPanel = quizBlock.find(".panel-listquiz");
                    //questionList = questionListPanel.find(".question-list");
                    panelListQuiz = commonPanel.find(".panel-listquiz");
                    questionList = panelListQuiz.find(".question-list");
                }

                if (questionElement.length > 0) {
                    // Cập nhật nội dung câu hỏi
                    questionElement.find(".question-description").html(cleanDescription);
                } else {
                    // Nếu là câu hỏi mới, thêm vào cuối danh sách
                    let newQuestionHtml = `
                <div class="question-content flex-space-between" data-question-id="${response.questionId}">
                    <div class="item-title" style="display:flex">
                        <strong class="question-number">${panelListQuiz.find(".question-content").length + 1}.</strong>
                        <span class="question-description mb-0">${cleanDescription}</span>
                        <span class="question-type">Trắc nghiệm một đáp án</span>
                    </div>
                    <div class="action-icons">
                        <a href="javascript:void(0)" class="btn-edit-quiz" data-quiz-id="${quizId}" data-question-id="${response.questionId}">
                            <i class="fas fa-pencil-alt"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-delete-item" data-item-id="${response.questionId}" data-item-type="Quiz">
                            <i class="fas fa-trash"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-move-item">
                            <i class="fas fa-bars"></i>
                        </a>
                    </div>
                </div>
            `;
                    questionList.append(newQuestionHtml);
                }

                // ✅ Hiển thị danh sách câu hỏi nếu đang bị ẩn
                panelListQuiz.show();

                // ✅ Ẩn panel nhập câu hỏi
                quizBlock.find(".panel-quiz").hide();

                // ✅ Kiểm tra nếu `.btn-chevron` chưa tồn tại, thì thêm vào
                if (quizBlock.find(".btn-chevron").length === 0) {
                    debugger
                    console.warn("⚠️ Không tìm thấy .btn-chevron, tạo mới...");
                    let chevronHtml = `<button type="button" class="btn-chevron" onclick="toggleContent('quiz_${quizId}')">
                                    <i class="icofont-rounded-down"></i>
                               </button>`;
                    quizBlock.find(".lesson-header .action-buttons").append(chevronHtml);
                }

                // ✅ Hiển thị nút mở rộng (chevron) nếu cần
                quizBlock.find(".btn-chevron").show();

                // ✅ Cuộn xuống để hiển thị câu hỏi mới nhất
                setTimeout(() => {
                    $('html, body').animate({
                        scrollTop: questionList.find(".question-content").last().offset().top
                    }, 300);
                }, 200);

                console.log("✅ Câu hỏi đã được thêm vào danh sách!");
            } else {
                alert("Lưu thất bại: " + response.message);
            }
        },
        error: function () {
            alert("Đã xảy ra lỗi!");
        }
    });


});






//Lession


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



// Khi nhấn "Nội dung" hoặc "Câu Hỏi"
$(document).on("click", ".btn-toggle-content", function () {
    debugger;
    const lessonBlock = $(this).closest(".lesson-block");
    $(".common-quiz").show();

    // Xác định xem đây là Quiz hay Lesson
    const isQuiz = $(this).data("item-type") === "Quiz";

    // Nếu là Quiz, tìm `quiz-wrapper`, nếu là Lesson, tìm `lesson-content-wrapper`
    const wrapper = isQuiz ? lessonBlock.find(".quiz-wrapper") : lessonBlock.find(".lesson-content-wrapper");

    // Nếu là Quiz, dùng `common-panel1`, nếu là Lesson, dùng `common-panel`
    const commonPanel = isQuiz ? wrapper.find(".common-panel1") : wrapper.find(".common-panel");

    // Ẩn panel mặc định (Mô tả và Tài nguyên)
    wrapper.find(".panel-default").hide();

    // Hiển thị panel Nội dung và cập nhật tiêu đề động
    commonPanel.attr("data-current-panel", "content").show();
    wrapper.find(".panel-content").show();

    // Cập nhật tiêu đề động
    wrapper.find(".dynamic-title").text(isQuiz ? "Thêm câu hỏi trắc nghiệm" : "Chọn loại nội dung");

    // Đảm bảo khu vực hiển thị chính xác
    wrapper.show();
});


let quizOpened = false; // Biến đánh dấu người dùng đã mở quiz từ "Trắc nghiệm một đáp án"
$(document).on("click", ".btn-file, .btn-file1", function (e) {
    debugger
    e.preventDefault(); // Ngăn chặn hành vi mặc định

    const type = $(this).data("type"); // Lấy giá trị data-type (video, article, quiz)
    const itemId = $(this).data("item-id"); // Lấy ID bài giảng hoặc quiz
    const wrapper = $(this).closest(".panel-content").parent(); // Tìm phần tử cha chứa các panel
    const wrapper2 = $(`#quiz_${itemId} .lesson-content-wrapper`);
    const commonQuiz = wrapper2.find(".common-panel.common-quiz");

    console.log(`📂 Người dùng chọn loại nội dung: ${type}`);

    // Ẩn tất cả các panel trước khi hiển thị panel cần chọn
    wrapper.find(".panel-content, .panel-upload-video, .panel-upload-article, .panel-quiz").hide();
    $(`#lesson_${itemId} .btn-toggle-content, #quiz_${itemId} .btn-toggle-content`).hide(); // ✅ Ẩn "Nội dung" khi chọn loại nội dung

    if (type === "video") {
        // ✅ Khi chọn Video, hiển thị panel video
        wrapper.find(".panel-upload-video").attr("data-type", "video").show();
        wrapper.find(".dynamic-title").text("Tải lên Video");
    } else if (type === "article") {
        // ✅ Khi chọn Bài Viết, hiển thị panel bài viết
        wrapper.find(".panel-upload-article").show();
        wrapper.find(".dynamic-title").text("Thêm Bài Viết");

        setTimeout(function () {
            const textareaId = `#text-editor-chapter-${itemId}`;
            if ($(textareaId).length > 0) {
                tinymce.remove(textareaId);
                _common.tinyMce(textareaId, 200);
            }
        }, 100);
    } else if (type === "quiz") {
        quizOpened = true; // Khi bấm vào "Trắc nghiệm một đáp án", đánh dấu đã mở quiz
        // ✅ Khi chọn Quiz, hiển thị panel quiz
        const panelQuiz = wrapper.find(".panel-quiz");
        panelQuiz.show();
        wrapper.find(".dynamic-title").text("Thêm Câu Hỏi Trắc Nghiệm");

        // ✅ Đánh dấu rằng panel được mở từ "Trắc nghiệm một đáp án"
        commonQuiz.attr("data-opened-from-quiz", "true");

        // ✅ Ẩn nút "Câu hỏi"
        $(`#quiz_${itemId} .btn-toggle-content`).hide();

        // ✅ Chờ panel mở xong rồi khởi tạo TinyMCE
        setTimeout(function () {
            const quizTextAreaId = `#text-editor-quiz-${itemId}`;

            if ($(quizTextAreaId).length > 0) {
                tinymce.remove(quizTextAreaId);
                _common.tinyMce(quizTextAreaId, 200);
            }

            // ✅ Khởi tạo TinyMCE cho 3 textarea mặc định
            panelQuiz.find(".text-editor-answer").each(function () {
                tinymce.init({
                    selector: `#${this.id}`,
                    height: 130,
                    plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                    toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                    imagetools_cors_hosts: ['picsum.photos'],
                    menubar: false
                   
                   
                   
                });
            });
        }, 100);
    }

    console.log(`✅ Đã mở panel upload cho: ${type}`);
});





//Lưu bài viết
$(document).on("click", ".btn-save-article", function () {
    debugger
    const lessonId = $(this).data("lesson-id"); // Lấy ID bài giảng
    const textareaId = `#text-editor-chapter-${lessonId}`;
    const articleContent = tinymce.get(`text-editor-chapter-${lessonId}`).getContent(); // Lấy nội dung TinyMCE

    if (!articleContent.trim()) {
        Swal.fire("Lỗi", "Nội dung bài viết không được để trống!", "error");
        return;
    }

    console.log(`📝 Đang lưu bài viết cho bài giảng ${lessonId}:`, articleContent);

    // Gửi dữ liệu lên server bằng AJAX
    $.ajax({
        url: "/Courses/SaveArticle",
        type: "POST",
        data: { lessonId: lessonId, article: articleContent },
        success: function (response) {
            if (response.isSuccess) {
                debugger
                Swal.fire("Thành công!", "Bài viết đã được lưu.", "success");

                // 🛠 **Ẩn tất cả các panel hiện tại**
                const lessonWrapper = $(`#lesson_${lessonId}`);
                lessonWrapper.find(".panel-content, .panel-upload-article").hide();
                lessonWrapper.find(".panel-default").show();

                lessonWrapper.find(".btn-resource").show();

                // 🛠 **Hiển thị `panel-baiviet`**
                lessonWrapper.find(".panel-baiviet").fadeIn("slow").css("display", "flex");
                lessonWrapper.find(".box-tailieu").fadeIn("slow");



            } else {
                Swal.fire("Lỗi", "Không thể lưu bài viết!", "error");
            }
        },
        error: function () {
            Swal.fire("Lỗi", "Có lỗi xảy ra khi lưu bài viết!", "error");
        }
    });
});

$(document).on("click", ".btn-edit-article", function () {
    const lessonId = $(this).data("lesson-id");
    const lessonWrapper = $(`#lesson_${lessonId}`);

    // 🛠 **Ẩn panel bài viết (`panel-baiviet`)**
    lessonWrapper.find(".panel-baiviet").hide();
    lessonWrapper.find(".btn-resource").hide();
    lessonWrapper.find(".box-tailieu").hide();




    // 🛠 **Hiển thị panel chỉnh sửa (`panel-upload-article`)**
    lessonWrapper.find(".panel-upload-article").fadeIn("slow");

    // ✅ **Khởi tạo lại TinyMCE**
    setTimeout(function () {
        const textareaId = `#text-editor-chapter-${lessonId}`;
        if ($(textareaId).length > 0) {
            tinymce.remove(textareaId); // Xóa TinyMCE cũ
            _common.tinyMce(textareaId, 200); // Khởi tạo TinyMCE mới
        }
    }, 100);
});

//==============================================================================

// Khi nhấn vào dấu "X" trong bất kỳ panel nào


$(document).on("click", ".btn-close-content", function () {
    debugger
    const wrapper = $(this).closest(".lesson-content-wrapper");
    const commonQuiz = wrapper.find(".common-panel.common-quiz");
    const panelQuiz = wrapper.find(".panel-quiz"); // Panel của Quiz
    const panelListQuiz = wrapper.find(".panel-listquiz"); // Danh sách câu hỏi
    const panelDefault = wrapper.find(".panel-default"); // Panel mặc định (nếu có)
    const panelUpload = wrapper.find(".panel-upload-article, .panel-content, .panel-upload-video"); // Panel bài viết & video
    const isQuiz = wrapper.closest(".lesson-block").attr("id").includes("quiz_"); // Xác định có phải Quiz không
    const lessonId = wrapper.closest(".lesson-block").attr("id").replace("lesson_", "");

    if (isQuiz) {
        // ✅ Nếu là Quiz, quay về danh sách câu hỏi thay vì ẩn hoàn toàn
        panelQuiz.hide();
        panelListQuiz.show();

        // ✅ Reset nội dung panel Quiz
        panelQuiz.find("textarea").val(""); // Xóa nội dung câu hỏi
        wrapper.find(".answer-list .answer-item").slice(3).remove(); // Xóa tất cả đáp án ngoại trừ 3 đáp án mặc định
        wrapper.find(".answer-list input[type='radio']").prop("checked", false); // Reset radio button

        // ✅ Kiểm tra nếu người dùng mở Quiz từ "Trắc nghiệm một đáp án" thì mới hiển thị lại nút "Câu hỏi"
        if (quizOpened) {
            const quizId = wrapper.closest(".lesson-block").attr("id").replace("quiz_", "");
            $(`#quiz_${quizId} .btn-toggle-content`).show();
            commonQuiz.hide();
        } else {
            const quizId = wrapper.closest(".lesson-block").attr("id").replace("quiz_", "");
            $(`#quiz_${quizId} .btn-toggle-content`).hide();
            commonQuiz.show();
        }

        // Reset flag sau khi đóng panel
        quizOpened = false;

        
    } else {
        // ✅ Nếu không phải Quiz, xử lý cho Chapter & Lesson
        panelUpload.hide(); // Ẩn panel bài viết nếu có
        wrapper.find(".panel-content, .panel-upload-video").hide(); // Ẩn các panel nội dung khác

        if (panelDefault.length) {
            // ✅ Nếu có panel mặc định, quay về panel mặc định
            panelDefault.show();
            wrapper.find(".dynamic-title").text("Chọn loại nội dung");
        } else {
            // ✅ Nếu không có panel mặc định, quay về danh sách câu hỏi
            panelListQuiz.show();
        }

        // ✅ Kiểm tra nếu bài giảng có nội dung (TinyMCE không rỗng), hiển thị lại phần liên quan
        const articleContent = tinymce.get(`text-editor-chapter-${lessonId}`)?.getContent().trim(); // Lấy nội dung bài viết
        const hasVideo = $(`#fileList_${lessonId} tr`).length > 0; // Kiểm tra có video không
        const hasArticle = articleContent && articleContent.length > 0; // Kiểm tra bài viết có nội dung không
        const hasResource = $(`#downloadList_${lessonId} tr`).length > 0; // Kiểm tra nếu có tài nguyên tải xuống

        if (hasArticle) {
            wrapper.find(".panel-baiviet").fadeIn("slow");
        }
        if (hasResource) {
            wrapper.find(".box-tailieu").fadeIn("slow");
        }
        if (wrapper.find(".btn-resource").length) {
            wrapper.find(".btn-resource").show();
        }

        // **➡ Kiểm tra điều kiện để hiển thị hoặc ẩn chữ "Nội dung"**
        if (!hasVideo && !hasArticle) {
            console.log("📌 Chưa có nội dung -> Hiển thị lại 'Nội dung'");
            $(`#lesson_${lessonId} .btn-toggle-content.toogle-article`).fadeIn("slow");
        } else {
            console.log("📌 Đã có nội dung -> Ẩn 'Nội dung'");
            $(`#lesson_${lessonId} .btn-toggle-content.toogle-article`).hide();
        }
    }
});


$(document).on("click", ".btn-close-content2", function () {
    debugger
    const wrapper = $(this).closest(".lesson-content-wrapper");
    const panelQuiz = wrapper.find(".panel-quiz"); // Panel của Quiz
    const panelListQuiz = wrapper.find(".panel-listquiz"); // Danh sách câu hỏi
    const panelContent = wrapper.find(".panel-content"); // Panel chọn nội dung
    const commonQuiz = wrapper.find(".common-quiz"); // Chỉ tìm `.common-quiz` trong bài giảng này

    panelContent.hide(); // Ẩn Panel Chọn Nội Dung
    commonQuiz.hide(); // Chỉ ẩn `.common-quiz` của quiz này
    wrapper.find(".toogle-quiz").show(); // Hiển thị lại nút "Câu hỏi"
    panelQuiz.hide(); // Ẩn Panel trắc nghiệm
});



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
    debugger
    const lessonId = $(this).data("lesson-id");
    const isReplaceArticle = $(this).hasClass("replace-from-article"); // Nếu là thay thế từ bài viết
    const wrapper = $(`#lesson_${lessonId}`);
    // 🛠 **Cập nhật lại `data-type` thành "video"**
    wrapper.find(".panel-upload-video").attr("data-type", "video");


    if (isReplaceArticle) {
        // 🛠 Xử lý THAY THẾ TỪ BÀI VIẾT -> VIDEO
        Swal.fire({
            title: "Xác nhận",
            text: "Bạn có chắc muốn thay thế bài viết bằng Video không? Dữ liệu bài viết sẽ bị xóa vĩnh viễn!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Có, thay thế!",
            cancelButtonText: "Hủy",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // 🛠 Gọi API để xóa bài viết trong CSDL
                $.ajax({
                    url: "/Courses/DeleteArticle",
                    type: "POST",
                    data: { lessonId: lessonId },
                    success: function (response) {
                        if (response.isSuccess) {
                            Swal.fire("Thành công!", "Bài viết đã bị xóa.", "success");

                            // 🛠 Xóa bài viết và tài nguyên liên quan
                            wrapper.find(".panel-baiviet").hide();
                            wrapper.find(".box-tailieu").hide();
                            wrapper.find(".btn-resource").hide();

                            // ✅ Kiểm tra và chỉ hiển thị `.panel-upload-video` nếu `data-type="video"`
                            const panelUpload = wrapper.find(".panel-upload-video");
                            if (panelUpload.attr("data-type") === "video") {
                                wrapper.find(".panel-default, .panel-content").hide();
                                panelUpload.fadeIn("slow");
                            }

                            // ✅ Reset input file để tránh lỗi upload file cũ
                            const fileInput = panelUpload.find(".custom-file-input");
                            fileInput.val("");
                            fileInput.next(".custom-file-label").text("Không có file nào được chọn");

                        } else {
                            Swal.fire("Lỗi", "Không thể xóa bài viết!", "error");
                        }
                    },
                    error: function () {
                        Swal.fire("Lỗi", "Có lỗi xảy ra khi xóa bài viết!", "error");
                    }
                });
            }
        });
    } else {
        // 🛠 Xử lý THAY THẾ VIDEO TRONG DANH SÁCH FILE VIDEO
        wrapper.find(".panel-default, .panel-content").hide();
        wrapper.find(".panel-upload-video").fadeIn("slow");
        wrapper.find(".dynamic-title").text("Thay thế Video");

        // Reset input file
        const fileInput = wrapper.find(".panel-upload-video .custom-file-input");
        fileInput.val("");
        fileInput.next(".custom-file-label").text("Không có file nào được chọn");
    }
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
                            if (fileList.children().length === 0) {
                                // Ẩn tiêu đề "Tài liệu có thể tải xuống"
                                fileList.closest('.box-tailieu').find('h6').fadeOut("slow");
                            }
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
    debugger;
    $(`#lesson_${lessonId} .panel-upload-video, #lesson_${lessonId} .btn-toggle-content`).hide();
    $(`#lesson_${lessonId} .panel-default`).fadeIn("slow");
    // ✅ Kiểm tra nếu là tài nguyên thì hiển thị "Nội dung"
    if (isResource) {
        console.log("📌 Upload tài nguyên - Hiển thị lại 'Nội dung'");
        $(`#lesson_${lessonId} .btn-toggle-content.toogle-article`).fadeIn("slow");
    } else {
        console.log("📌 Upload video - Ẩn 'Nội dung'");
        $(`#lesson_${lessonId} .btn-toggle-content.toogle-article`).hide();
    }

    // ✅ Kiểm tra xem trước đó "Nội dung" có bị ẩn hay không
    const wasContentHidden = $(`#lesson_${lessonId} .btn-toggle-content`).is(":hidden");

    if (!isResource) {
        // ✅ Nếu tải video, luôn ẩn "Nội dung"
        $(`#lesson_${lessonId} .btn-toggle-content`).hide();
    } else {
        // ✅ Nếu trước đó đã ẩn, giữ nguyên trạng thái ẩn
        if (!wasContentHidden) {
            const hasVideo = $(`#fileList_${lessonId} tr`).length > 0;
            const hasArticle = $(`#lesson_${lessonId} .panel-baiviet`).is(":visible"); // Kiểm tra bài viết đã có chưa

            if (!hasVideo && !hasArticle) {
                $(`#lesson_${lessonId} .btn-toggle-content`).show();
            } else {
                $(`#lesson_${lessonId} .btn-toggle-content`).hide();
            }
        }
    }

    // ✅ Gọi showUploadProgress để hiển thị tiến trình tải lên
    showUploadProgress(lessonId, files, isResource);
}



// Hiển thị trạng thái "Đang tải lên..." trong danh sách file
function showUploadProgress(lessonId, files, isResource) {
    debugger;
    const container = isResource ? `#downloadList_${lessonId}` : `#fileList_${lessonId}`;
    const fileList = $(container);
    const table = fileList.closest("table");

    // ✅ Khi upload video -> Ẩn tài nguyên
    if (!isResource) {
        $(`#boxTailieu_${lessonId}`).hide();
    }

    // ✅ Ẩn nút "Tài nguyên" khi upload video
    if (!isResource) {
        $(`.btn-resource[data-lesson-id="${lessonId}"]`).hide();
    }

    // ✅ Nếu upload video, xóa danh sách cũ nhưng giữ lại thead
    if (!isResource) {
        fileList.children("tr").remove(); // ❌ Xóa TR nhưng giữ nguyên THEAD nếu có
    }

    // 🛠 Nếu đang upload video, và bảng chưa có <thead>, thì thêm vào
    if (!isResource && table.find("thead").length === 0) {
        table.prepend(createTableHeader());
    }

    // ✅ Hiển thị progress
    files.forEach((file, index) => {
        const fileId = `uploadingRow_${lessonId}_${index}`;
        fileList.append(createUploadingRow(fileId, file, isResource));
    });

    // ✅ Luôn hiển thị danh sách file để thấy progress
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
    const header = boxTailieu.find("h6"); // ✅ Header "Tài liệu có thể tải xuống"

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
        header.hide(); // Ẩn tiêu đề
    } else {
        console.log("📢 Có tài nguyên, hiển thị box tài liệu!");
        boxTailieu.show();
        if (header.length === 0) {
            boxTailieu.prepend(`<h6>Tài liệu có thể tải xuống</h6>`); // ✅ Thêm tiêu đề nếu chưa có
        } else {
            header.show(); // ✅ Nếu có rồi thì hiển thị lại
        }
    }
    // ✅ Kiểm tra nếu có video -> Không hiển thị "Nội dung"
    const hasVideo = $(`#fileList_${lessonId} tr`).length > 0;
    if (hasVideo) {
        $(`#lesson_${lessonId} .btn-toggle-content`).hide();
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

// Xử lý khi nhấn "Xuất Bản"
document.getElementById("display-button").addEventListener("click", function () {
    debugger
    let displayButton = this;
    let currentStatus = displayButton.textContent.trim() === "Đã Xuất Bản" ? 0 : 2;

    Swal.fire({
        title: "Xác nhận",
        text: currentStatus === 0 ? "Bạn có muốn ẩn khóa học này không?" : "Bạn có muốn xuất bản khóa học này không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: currentStatus === 0 ? "Ẩn khóa học" : "Xuất Bản",
        cancelButtonText: "Hủy",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            let newStatus = currentStatus === 0 ? 2 : 0;

            _newsDetail1.OnSave(newStatus, "status_update");
        }
    });
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


    OnSave: function (articleStatus, button_type = "save") {
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
                Status: articleStatus , // 0 = Xuất bản, 2 = Lưu tạm
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
            formData.append("button_type", button_type); // ✅ Xác định gọi từ đâu

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