class Student {
    fullName: String;
    constructor(
        public fName: string,
        public mName: string,
        public lName: string
    ) {
        this.fullName = fName + " " + mName + " " + lName;
    }
}
interface Person {
    fName: string;
    mName: string;
    lName: string;
}
function greeter(person: Person) {
    return "Hi, " + person.fName + " " + person.mName + " " + person.lName;
}

let user = new Student("Saranya", "S", "Balasubramani");
document.body.textContent = greeter(user);