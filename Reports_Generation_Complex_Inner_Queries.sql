/* 
list of all candidiates qualified or not qualified and
*/
/*
step(1) find all exam papers as array of ids 
*/
SELECT paperExamPivot.paperId_FK as paperId FROM paperExamPivot where paperExamPivot.examId_FK=31
/*
step(2) find all major attempts as an array of ids where examId and paperid are given 
step(3) find all major attempts as an array of ids where examId and paperid are given 
*/
SELECT * FROM majorAttempt JOIN user ON majorAttempt.user_FK=user.id WHERE majorAttempt.exam_FK=31 AND majorAttempt.paper_FK in (SELECT paperExamPivot.paperId_FK as paperId FROM paperExamPivot WHERE paperExamPivot.examId_FK=31)
/*
step(4) join users and papers table and select fields you want to  
*/
SELECT papers.paperName, papers.paperTime, papers.passingMarks, user.username as userName, user.email as userEmail, majorAttempt.id as mId, majorAttempt.passingUnitMarks, majorAttempt.totalQuestions, majorAttempt.attemptedQuestions, majorAttempt.unattemptedQuetions, majorAttempt.correctAnswers, majorAttempt.incorrectAnswers, majorAttempt.totalMarks, majorAttempt.obtainedMarks, majorAttempt.status FROM majorAttempt JOIN user ON majorAttempt.user_FK=user.id JOIN papers ON papers.paperId=majorAttempt.paper_FK WHERE majorAttempt.exam_FK=31 AND majorAttempt.paper_FK IN (SELECT paperExamPivot.paperId_FK as paperId FROM paperExamPivot WHERE paperExamPivot.examId_FK=31)
