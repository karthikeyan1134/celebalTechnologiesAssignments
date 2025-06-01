import React, { useState, useEffect } from "react";
import "./style.css";

const Todo = () => {
	const [items, setItems] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [filterText, setFilterText] = useState("");
	const [sortKey, setSortKey] = useState("name");
	const [sortOrder, setSortOrder] = useState("asc");
	const [editIndex, setEditIndex] = useState(null);
	const [editValue, setEditValue] = useState("");
	const [tag, setTag] = useState("");
	const [tagFilter, setTagFilter] = useState("");

	useEffect(() => {
		const storedItems = JSON.parse(localStorage.getItem("todoItems")) || [];
		setItems(storedItems);
	}, []);

	useEffect(() => {
		localStorage.setItem("todoItems", JSON.stringify(items));
	}, [items]);

	const handleAdd = () => {
		if (inputValue.trim() === "") return;
		const newItem = {
			text: inputValue.trim(),
			timestamp: Date.now(),
			completed: false,
			tag: tag.trim(),
		};
		setItems([...items, newItem]);
		setInputValue("");
		setTag("");
	};

	const handleDelete = (index) => {
		const newItems = items.filter((_, i) => i !== index);
		setItems(newItems);
	};

	const handleEdit = (index) => {
		setEditIndex(index);
		setEditValue(items[index].text);
	};

	const handleEditSave = (index) => {
		const updated = [...items];
		updated[index].text = editValue;
		updated[index].timestamp = Date.now();
		setItems(updated);
		setEditIndex(null);
	};

	const toggleComplete = (index) => {
		const updated = [...items];
		updated[index].completed = !updated[index].completed;
		setItems(updated);
	};

	const sortItems = (list) => {
		return [...list].sort((a, b) => {
			let comparison = 0;
			if (sortKey === "name") {
				comparison = a.text.localeCompare(b.text);
			} else if (sortKey === "date") {
				comparison = a.timestamp - b.timestamp;
			}
			return sortOrder === "asc" ? comparison : -comparison;
		});
	};

	const filteredItems = sortItems(items).filter(
		(item) =>
			item.text.toLowerCase().includes(filterText.toLowerCase()) &&
			(tagFilter === "" || item.tag === tagFilter)
	);

	const uniqueTags = [
		...new Set(items.map((item) => item.tag).filter((tag) => tag)),
	];

	return (
		<div className="TodoWrapper">
			<h2>Todo List</h2>

			<div className="TodoForm">
				<input
					className="todo-input"
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Add a new task"
				/>
				<input
					className="todo-input"
					type="text"
					value={tag}
					onChange={(e) => setTag(e.target.value)}
					placeholder="Add tag (e.g., work, home)"
				/>
				<button className="todo-btn" onClick={handleAdd}>
					Add
				</button>
			</div>

			<div className="filter-sort-wrapper">
				<input
					className="todo-input"
					type="text"
					value={filterText}
					onChange={(e) => setFilterText(e.target.value)}
					placeholder="Search tasks"
				/>
				<select
					className="todo-input"
					value={tagFilter}
					onChange={(e) => setTagFilter(e.target.value)}>
					<option value="">Filter by Tag</option>
					{uniqueTags.map((t, idx) => (
						<option key={idx} value={t}>
							{t}
						</option>
					))}
				</select>

				<select
					className="todo-input"
					value={sortKey}
					onChange={(e) => setSortKey(e.target.value)}>
					<option value="name">Sort by Name</option>
					<option value="date">Sort by Date Modified</option>
				</select>

				<select
					className="todo-input"
					value={sortOrder}
					onChange={(e) => setSortOrder(e.target.value)}>
					<option value="asc">Ascending</option>
					<option value="desc">Descending</option>
				</select>
			</div>

			<ul style={{ listStyle: "none", padding: 0, marginTop: "15px" }}>
				{filteredItems.map((item, index) => (
					<li key={index} className="Todo">
						<div>
							<input
								type="checkbox"
								checked={item.completed}
								onChange={() => toggleComplete(index)}
							/>
							{editIndex === index ? (
								<input
									className="todo-input"
									type="text"
									value={editValue}
									onChange={(e) => setEditValue(e.target.value)}
									style={{ marginLeft: "10px" }}
								/>
							) : (
								<span
									className={item.completed ? "completed" : "incompleted"}
									style={{ marginLeft: "10px" }}>
									{item.text}
								</span>
							)}
							{item.tag && (
								<span
									style={{
										marginLeft: "10px",
										fontSize: "0.85em",
										color: "#ddd",
									}}>
									[{item.tag}]
								</span>
							)}
						</div>
						<div>
							{editIndex === index ? (
								<button
									className="todo-btn"
									onClick={() => handleEditSave(index)}>
									Save
								</button>
							) : (
								<button
									className="todo-btn edit-icon"
									onClick={() => handleEdit(index)}>
									Edit
								</button>
							)}
							<button
								className="todo-btn delete-icon"
								style={{ marginLeft: "5px" }}
								onClick={() => handleDelete(index)}>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Todo;
