import { useState, useEffect } from "react";
import "./Todos.css";

const Select = ({ onSort }) => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    const sortType = event.target.value;
    setSelectedValue(sortType);
    onSort(sortType);
  };

  return (
    <div className="selectComp">
      <label htmlFor="select">Choose an option:</label>
      <select id="select" value={selectedValue} onChange={handleChange}>
        <option value="">--Please choose an option--</option>
        <option value="serial">Serial</option>
        <option value="execution">Execution</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="random">Random</option>
        <option value="completed">Completed</option>
        <option value="uncompleted">Uncompleted</option>
      </select>
      <p>You selected: {selectedValue}</p>
    </div>
  );
};

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [choice, setChoice] = useState("");
  const [newTodoFormVisible, setNewTodoFormVisible] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [editingTodo, setEditingTodo] = useState(null); // New state for editing post
  const [updatedTodoTitle, setUpdatedTodoTitle] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        var user = JSON.parse(localStorage.getItem("currentUser"));
        const response = await fetch(
          `http://localhost:3000/api/users/${user.id}/todos`
        );
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const handleToggleTodo = async (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        const updatedTodo = {
          ...todo,
          completed: !todo.completed,
        };

        // Make PUT request to update the server-side data
        fetch(`http://localhost:3000/api/todos/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodo),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error(error));

        return updatedTodo;
      }
      return todo;
    });

    setTodos(updatedTodos);
  };

  const handleSortTodos = async (sortType) => {
    let sortedTodos = [...todos];

    switch (sortType) {
      case "serial":
        sortedTodos.sort((a, b) => a.id - b.id);
        break;
      case "execution":
        sortedTodos.sort((a, b) => a.completed - b.completed);
        break;
      case "alphabetical":
        sortedTodos.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "random":
        sortedTodos.sort(() => Math.random() - 0.5);
        break;
      case "completed":
        sortedTodos = await handleCompleted();
        break;
      case "uncompleted":
        sortedTodos = await handleUnCompleted();
        break;
      default:
        break;
    }

    setTodos(sortedTodos);
  };

  const handleCompleted = async () => {
    try {
      var user = JSON.parse(localStorage.getItem("currentUser"));
      const response = await fetch(
        `http://localhost:3000/api/users/${user.id}/todos?completed=1`
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnCompleted = async () => {
    try {
      var user = JSON.parse(localStorage.getItem("currentUser"));
      const response = await fetch(
        `http://localhost:3000/api/users/${user.id}/todos?completed=0`
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      // Make DELETE request to remove the post from the server-side
      await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: "DELETE",
      });

      // Update the display by removing the deleted post
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChoiceChange = (event) => {
    const check = event.target.value === "yes" ? 1 : 0;
    setChoice(check);
  };

  const handleCreateTodo = async (e) => {
    e.preventDefault();

    try {
      var user = JSON.parse(localStorage.getItem("currentUser"));
      const response = await fetch(
        `http://localhost:3000/api/users/${user.id}/todos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTodoTitle, completed: choice }),
        }
      );

      const data = await response.json();

      setTodos((prevTodos) => [...prevTodos, data]);

      setNewTodoTitle("");
      setChoice("");

      setNewTodoFormVisible(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateTodo = async (todoId) => {
    // Find the todo being edited
    const todo = todos.find((todo) => todo.id === todoId);

    // Create an updated todo object with the new title and the existing completed status
    const updatedTodo = {
      ...todo,
      title: updatedTodoTitle,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/todos/${todoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodo),
        }
      );

      if (response.ok) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === todoId ? updatedTodo : todo))
        );
        setEditingTodo(null);
        setUpdatedTodoTitle("");
      } else {
        console.error("Error updating todo:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdate = async (todoId) => {
    setEditingTodo(todoId);
    // Find the todo being edited
    const todo = todos.find((todo) => todo.id === todoId);

    // Set the initial values of the update title and body
    setUpdatedTodoTitle(todo.title);
  };

  return (
    <div className="todos-container">
      <h1 className="todos-header">Todos</h1>
      <div className="todos-new">
        {newTodoFormVisible ? (
          <form onSubmit={handleCreateTodo}>
            <input
              type="text"
              placeholder="Enter todo title"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              required
            />
            <br />
            <div>
              <label>
                <input
                  type="radio"
                  name="choice-radio"
                  value="yes" // Step 3: Assign the value for "Yes"
                  checked={choice === 1} // Step 4: Check if the choice is "Yes"
                  onChange={handleChoiceChange} // Step 2: Handle change event
                  required
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="choice-radio"
                  value="no" // Step 3: Assign the value for "No"
                  checked={choice === 0} // Step 4: Check if the choice is "No"
                  onChange={handleChoiceChange} // Step 2: Handle change event
                  required
                />
                No
              </label>
            </div>

            <br />
            <button type="submit">Create Todo</button>
          </form>
        ) : (
          <button onClick={() => setNewTodoFormVisible(true)}>
            Create New Todo
          </button>
        )}
      </div>
      <Select onSort={handleSortTodos} />
      <div className="background">
        <div className="todos-list">
          {todos.map((todo) => (
            <div key={todo.id} className="todo-item">
              <div>
                {editingTodo === todo.id ? (
                  <div>
                    <input
                      type="text"
                      value={updatedTodoTitle}
                      onChange={(e) => setUpdatedTodoTitle(e.target.value)}
                    />
                    <br />
                    <div className="button-container">
                      <button onClick={() => handleUpdateTodo(todo.id)}>
                        Save Changes
                      </button>
                      <button onClick={() => setEditingTodo(null)}>
                        Cancel Editing
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <label className="todo-label">
                      <span className="todo-title">{todo.title}</span>
                      <input
                        type="checkbox"
                        className="todo-checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo.id)}
                      />
                      <span className="todo-checkmark"></span>
                    </label>
                    <div className="button-container">
                      <button onClick={() => handleDeleteTodo(todo.id)}>
                        Delete Todo
                      </button>
                      <button onClick={() => handleUpdate(todo.id)}>
                        Update Todo
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Todos;
