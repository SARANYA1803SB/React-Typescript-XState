var Student = /** @class */ (function () {
    function Student(fName, mName, lName) {
        this.fName = fName;
        this.mName = mName;
        this.lName = lName;
        this.fullName = fName + " " + mName + " " + lName;
    }
    return Student;
}());
function greeter(person) {
    return "Hi, " + person.fName + " " + person.mName + " " + person.lName;
}
var user = new Student("Saranya", "S", "Balasubramani");
document.body.textContent = greeter(user);
