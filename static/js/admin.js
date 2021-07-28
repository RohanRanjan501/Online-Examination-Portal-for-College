let newQuestion = document.getElementById('newQuestion');
let addStudent = document.getElementById('addStudent');
let scheduleTest = document.getElementById('scheduleTest');
let addStudentBtn = document.getElementById('addStudentBtn');
let addNewQuestionBtn = document.getElementById('addNewQuestionBtn');
let scheduleTestBtn = document.getElementById('scheduleTestBtn');

addStudent.style.display = 'none';
scheduleTest.style.display = 'none';
addNewQuestionBtn.style.display = 'none';
addStudentBtn.addEventListener('click', ()=>{
    addStudentBtn.style.display = 'none';
    addNewQuestionBtn.style.display = 'block';
    scheduleTestBtn.style.display = 'block';
    addStudent.style.display = 'block';
    newQuestion.style.display = 'none';
    scheduleTest.style.display = 'none';
})
addNewQuestionBtn.addEventListener('click', ()=>{
    addNewQuestionBtn.style.display = 'none';
    scheduleTestBtn.style.display = 'block';
    addStudentBtn.style.display = 'block';
    newQuestion.style.display = 'block';
    addStudent.style.display = 'none';
    scheduleTest.style.display = 'none';
})
scheduleTestBtn.addEventListener('click', ()=>{
    scheduleTestBtn.style.display = 'none';
    addStudentBtn.style.display = 'block';
    addNewQuestionBtn.style.display = 'block';
    scheduleTest.style.display = 'block';
    addStudent.style.display = 'none';
    newQuestion.style.display = 'none';
})

newQuestion.addEventListener('submit', (e)=>{
    let radio = document.getElementsByName('correctOption');
    isRadioChecked = false;
    Array.from(radio).forEach((element)=>{
        if(element.checked){    
            isRadioChecked = true; 
        }
    })
    if( document.getElementById('testName').value=='' || (document.getElementById('question').value=='') || (document.getElementById('optionA').value=='') || (document.getElementById('optionB').value=='') || (document.getElementById('optionC').value=='') || (document.getElementById('optionD').value=='') || (isRadioChecked ==false)){
        alert();
        e.preventDefault();
    }
})

addStudent.addEventListener('submit', (e)=>{
    if( document.getElementById('studentName').value=='' || 
        (document.getElementById('id').value=='') || 
        (document.getElementById('password').value=='')
        ){
        alert();
        e.preventDefault();
    }
})

scheduleTest.addEventListener('submit', (e)=>{
    if( document.getElementById('name').value=='' || 
        (document.getElementById('dateTime').value=='') || 
        (document.getElementById('duration').value=='')
        ){
        alert();
        e.preventDefault();
    }
})

function alert(){
    let html = `<div style="height: 45px;" class="alert alert-danger alert-dismissible fade show" role="alert"><center>
                    <strong>Required</strong> Fill all the details.
                    </center>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>`
    document.getElementById('alert').innerHTML = html;    
    setTimeout(()=>{
        document.getElementById('alert').innerHTML = ``  
    }, 4000)
}