class Task {
    constructor(id, title, description, dueDate, completed) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.completed = completed;
    }
}

module.exports = Task;
