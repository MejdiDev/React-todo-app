import ReactDOM from "react-dom";
import React, {useEffect, useState} from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import $ from 'jquery';
import './index.css';

if(window.localStorage.getItem('todos') === null){
  const stringArray = JSON.stringify(
    [
    {
        "id": "item-Complete-online-JavaScript-course",
        "content": "Complete online JavaScript course"
    },
    {
        "id": "item-Jog-around-the-park-3x",
        "content": "Jog around the park 3x"
    },
    {
        "id": "item-10-minutes-meditation",
        "content": "10 minutes meditation"
    },
    {
        "id": "item-Read-for-1-hour",
        "content": "Read for 1 hour"
    },
    {
        "id": "item-Pick-up-groceries",
        "content": "Pick up groceries"
    },
    {
        "id": "item-Complete-Todo-App-on-Frontend-Mentor",
        "content": "Complete Todo App on Frontend Mentor"
    }
  ]
  );

  window.localStorage.setItem('todos', stringArray);
  window.localStorage.setItem('active', JSON.stringify(['Complete online JavaScript course']));
}

if(window.localStorage.getItem('todos') === null){
  window.localStorage.setItem('todos', JSON.stringify([]));
}

let added = false;

let Light = true;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Type = () => {
  const [todos , setTodos] = useState(JSON.parse(window.localStorage.getItem('todos') || "[]"));

  const [task , setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    let tempo = [];

    todos.forEach(item => {
      tempo.push(Object.values(item)[1]);
    });

    if(!tempo.includes(task.trim()) && task.trim().length !== 0){
      const taskId = task.replaceAll(" ", "-");

      todos.push(
        {
          id: 'item-' + taskId,
          content: task
        }
      );

      window.localStorage.setItem('todos', JSON.stringify(todos));

      added = true;
    }

    setTask("");
  }

  const handleChange = (e) => {
    setTask(e.target.value);
  }

	const changeTheme = (e) => {
		if(Light){
			if(e.target.tagName === "BUTTON"){
        e.target.children[0].src="https://todo-app-frontendmentor.vercel.app/static/media/icon-sun.910b1f9a.svg";
			  Light = false;
      }

      else{
        e.target.src="https://todo-app-frontendmentor.vercel.app/static/media/icon-sun.910b1f9a.svg";
			  Light = false;
      }
		}

		else{
			if(e.target.tagName === "BUTTON"){
        e.target.children[0].src="https://todo-app-frontendmentor.vercel.app/static/media/icon-moon.6c03114b.svg";
			  Light = true;
      }

      else{
        e.target.src="https://todo-app-frontendmentor.vercel.app/static/media/icon-moon.6c03114b.svg";
			  Light = true;
      }
		}

    document.querySelectorAll('#task').forEach(element => {
      element.style.transitionDuration = "300ms";
    });

		$('*').toggleClass("dark");
	}

	return(
		<div id="type">
			<div id="settings">
				<h1>TODO</h1>
				<button onClick={changeTheme} id="themeButton">
          <img src="https://todo-app-frontendmentor.vercel.app/static/media/icon-moon.6c03114b.svg" id="moon" alt="light" />
        </button>
			</div>

			<div id="form">
				<div id="radio"></div>
				<form onSubmit={handleSubmit}>
					<input value={task} onChange={handleChange} type="text" placeholder="Create a new todo..." />
				</form>
			</div>

			<List array={todos} handler={setTodos} />

		</div>
	);
}

const List = (props) => {
  const [active , setActive] = useState(JSON.parse(window.localStorage.getItem('active') || "[]"));
  const [tasksLeft , setTasksLeft] = useState(JSON.parse(window.localStorage.getItem('todos') || "[]").length - JSON.parse(window.localStorage.getItem('active') || "[]").length);
  const [reference , setReference] = useState(props.array);
  const [status , setStatus] = useState("all");

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const all = reorder(
      props.array,
      result.source.index,
      result.destination.index
    );

    props.handler(all);

    window.localStorage.setItem('todos', JSON.stringify(all));

    if(String(reference) === String(props.array)){
      setReference(all);
    }

    document.querySelectorAll("#task").forEach(element => {
      element.style.transitionDuration = "0s";
    });
  }

  const Delete = (e) => {
    const text = e.target.parentNode.children[1].innerText;

    setReference(reference.filter(item => item.content !== text));

    window.localStorage.setItem('todos', JSON.stringify(reference.filter(item => item.content !== text)));
    
    props.handler(props.array.filter(item => item.content !== text));

    if(!active.includes(text)){
      setTasksLeft(tasksLeft - 1);
    }

    else{
      setActive(active.filter(item => item !== text));

      window.localStorage.setItem('active', JSON.stringify(active.filter(item => item !== text)));
    }
  }

  const Activate = (e) => {
    if(e.target.tagName === "BUTTON"){
      e.target.classList.toggle('active');
      e.target.parentNode.children[1].classList.toggle('active');

      const text = e.target.parentNode.children[1].innerText;

      if(!active.includes(text)){
        active.push(text);
        
        window.localStorage.setItem('active', JSON.stringify(active));

        setTasksLeft(tasksLeft - 1);

        if(status === "active"){
          props.handler(props.array.filter(item => item.content !== text));
        }
      }

      else{
        setActive(active.filter(item => item !== text));

        window.localStorage.setItem('active', JSON.stringify(active.filter(item => item !== text)));

        setTasksLeft(tasksLeft + 1);

        if(status === "completed"){
          if(active.length !== 0){
            props.handler(props.array.filter(item => item.content !== text));
          }
        }
      }
    }

    if(e.target.tagName === "IMG"){
      e.target.parentNode.classList.toggle('active');
      e.target.parentNode.parentNode.children[1].classList.toggle('active');

      const text = e.target.parentNode.parentNode.children[1].innerText;

      if(!active.includes(text)){
        active.push(text);
        
        window.localStorage.setItem('active', JSON.stringify(active));

        setTasksLeft(tasksLeft - 1);

        if(status === "active"){
          props.handler(props.array.filter(item => item.content !== text));
        }
      }

      else{
        setActive(active.filter(item => item !== text));

        window.localStorage.setItem('active', JSON.stringify(active.filter(item => item !== text)));

        setTasksLeft(tasksLeft + 1);

        if(status === "completed"){
          if(active.length !== 0){
            props.handler(props.array.filter(item => item.content !== text));
          }
        }
      }
    }
  }

  const Clear = () => {
    if(active.length !== 0){
      let array = reference;

      active.forEach(item => {
        array = array.filter(task => task.content !== item);
      });

      window.localStorage.setItem('todos', JSON.stringify(array));

      if(status === "completed"){
        if(active.length !== 0){
          props.handler([]);
        }
      }

      else if(status === "all"){
        props.handler(array);
      }

      setReference(array);

      window.localStorage.setItem('active', JSON.stringify([]));

      setActive([]);
    }
  }

  const showAll = (e) => {
    e.target.parentNode.children[1].classList.remove('active');
    e.target.parentNode.children[2].classList.remove('active');
    e.target.classList.add('active');

    if(e.target.parentNode.id === "externalSelect"){
      document.querySelectorAll("#select button")[0].classList.add('active');
      document.querySelectorAll("#select button")[1].classList.remove('active');
      document.querySelectorAll("#select button")[2].classList.remove('active');
    }

    else{
      document.querySelectorAll("#externalSelect button")[0].classList.add('active');
      document.querySelectorAll("#externalSelect button")[1].classList.remove('active');
      document.querySelectorAll("#externalSelect button")[2].classList.remove('active');
    }

    document.getElementById('empty').style.display = "none";

    setStatus("all");
    props.handler(reference);
  }

  const showActive = (e) => {
    e.target.parentNode.children[0].classList.remove('active');
    e.target.parentNode.children[2].classList.remove('active');
    e.target.classList.add('active');

    if(e.target.parentNode.id === "externalSelect"){
      document.querySelectorAll("#select button")[1].classList.add('active');
      document.querySelectorAll("#select button")[0].classList.remove('active');
      document.querySelectorAll("#select button")[2].classList.remove('active');
    }

    else{
      document.querySelectorAll("#externalSelect button")[1].classList.add('active');
      document.querySelectorAll("#externalSelect button")[0].classList.remove('active');
      document.querySelectorAll("#externalSelect button")[2].classList.remove('active');
    }

    document.getElementById('empty').style.display = "none";

    let uniqueTasks = [];

    reference.forEach(item => {
      if(!active.includes(item.content)){
        uniqueTasks.push(item);
      }
    });

    setStatus("active");

    props.handler(uniqueTasks);
  }

  const showCompleted = (e) => {
    e.target.parentNode.children[0].classList.remove('active');
    e.target.parentNode.children[1].classList.remove('active');
    e.target.classList.add('active');

    if(e.target.parentNode.id === "externalSelect"){
      document.querySelectorAll("#select button")[2].classList.add('active');
      document.querySelectorAll("#select button")[1].classList.remove('active');
      document.querySelectorAll("#select button")[0].classList.remove('active');
    }

    else{
      document.querySelectorAll("#externalSelect button")[2].classList.add('active');
      document.querySelectorAll("#externalSelect button")[1].classList.remove('active');
      document.querySelectorAll("#externalSelect button")[0].classList.remove('active');
    }

    document.getElementById('empty').style.display = "none";

    if(active.length === 0){
      props.handler([]);
    }

    else{
      let array = [];

      active.forEach(item => {
        const taskCompletedId = 'item-' + item.replaceAll(" ", "-");
        array.push(
          {
            id: taskCompletedId,
            content: item
          }
        );

        props.handler(array);
      });
    }

    setStatus("completed");
  }

  const setDragAnimation = () => {
    document.querySelectorAll("#task").forEach(element => element.style.transitionDuration = "300ms");
  }

  useEffect(() => {

    document.getElementById('root').style.height = String(document.getElementById('todosContainer').offsetHeight + 600) + "px";

    
    for(let i = 0; i < props.array.length; i++){
			document.querySelectorAll('#actual-text')[i].classList.remove('active');
			document.querySelectorAll('.radio')[i].classList.remove('active');

			if(active.includes(document.querySelectorAll('#actual-text')[i].innerText)){
				document.querySelectorAll('#actual-text')[i].classList.add('active');
				document.querySelectorAll('.radio')[i].classList.add('active');
			}
		}

    if(props.array.length === 0){
      if(status === "all"){
        document.getElementById('empty').innerHTML = "👀 Todo list is empty<br />Add your first todo above ☝️";
      }

      if(status === "active"){
        document.getElementById('empty').innerHTML = "🔥 All your tasks are done !<br />Go Add something new to your list ✅";
      }

      if(status === "completed"){
        document.getElementById('empty').innerHTML = "❌ You have no completed tasks<br />Go get something done ✔️";
      }

      document.getElementById('empty').style.display = "block";
      document.getElementById('options').style.display = "flex";
    }

    if(props.array.length > 0){
      if(status === "all"){
        document.getElementById('options').style.display = "flex";
      }

      else{
        document.getElementById('options').style.display = "flex";
      }
    }

    if(added){
      document.getElementById('empty').style.display = "none";
      document.getElementById('options').style.display = "flex";

      setTasksLeft(tasksLeft + 1);

      if(status !== "all"){

        reference.push(props.array[props.array.length - 1]);

        window.localStorage.setItem('todos', JSON.stringify(reference));

        if(status === "completed"){
          props.array.pop();
        }
      }
      
      added = false;
    }
  });

    return (
      <div id="todosContainer">
      <div id="todos">

        <div id="empty"></div>
      
        <DragDropContext onDragStart={setDragAnimation} onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {provided => (
              <div id="tasks" {...provided.droppableProps} ref={provided.innerRef} >
                {props.array.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {provided => (
                      <div class={Light ? "" : "dark"} id="task" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                        <button class={"radio" + (Light ? "" : " dark")} onClick={Activate}>
                          <img src="https://todo-app-frontendmentor.vercel.app/static/media/icon-check.a8fb15d0.svg" alt="check" />
                        </button>
                        <p class={Light ? "" : "dark"} id="actual-text">{item.content}</p>
                        <button class={Light ? "" : "dark"} id="cross" onClick={Delete}></button>
                      </div>
                    )}
                  </Draggable>
                ))}
                
                {provided.placeholder}

                <div id="options">

                  <p id="counter">{tasksLeft} Items left</p>

                  <div id="select">
                    <button onClick={showAll} id="all" class="active">All</button>
                    <button onClick={showActive}>Active</button>
                    <button onClick={showCompleted} id="completed">Completed</button>
                  </div>

                  <button id="clear" onClick={Clear}>
                    Clear Completed
                  </button>

                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div id="externalSelect">
        <button onClick={showAll} id="all" class="active">All</button>
        <button onClick={showActive}>Active</button>
        <button onClick={showCompleted} id="completed">Completed</button>
      </div>

      <p id="comment">Drag and drop to reorder list</p>

      </div>
    );
  
}

ReactDOM.render(<Type />, document.getElementById("root"));