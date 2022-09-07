import React from 'react'
import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { 
	selectAllTasks,
	selectCurrentProject,
	updateCurrentProject
} from '../../redux/todoSlice/todoSlice'
import { format } from 'date-fns'
import { 
	selectTaskEditor, 
	selectTaskMaker, 
	toggleTaskEditor 
} from '../../redux/uiSlice';
import { updateTask } from '../../redux/todoSlice/tasks';

const onDragEnd = (result, tasks, columns, dispatch) => {
	if (!result.destination) return;
	const {source, destination} = result;
	const task = tasks.find(task => task._id === result.draggableId);
	if (source.droppableId !== destination.droppableId) {
		const sourceCol = columns[source.droppableId];
		const destCol = columns[destination.droppableId];
		const sourceItems = [...sourceCol.items];
		const destItems = [...destCol.items]
		const [removed] = sourceItems.splice(source.index, 1);
		destItems.splice(destination.index, 0, removed);
		dispatch(updateCurrentProject({
			[source.droppableId]: {
				...sourceCol,
				items: sourceItems,
			},
			[destination.droppableId]: {
				...destCol,
				items: destItems,
			}
		}))
	} else {
		const col = columns[source.droppableId];
		const items = [...col.items];
		const [removed] = items.splice(source.index, 1);
		items.splice(destination.index, 0, removed);
		dispatch(updateCurrentProject({
			[source.droppableId]: {
				...col,
				items: items,
			},
		}))
	}
	const completeStatus = columns[destination.droppableId].title;
	let isCompleted = task.isCompleted;
	if (completeStatus === 'completed') {
		isCompleted = true;
	} else if (completeStatus === 'to do') {
		isCompleted = false;
	}
	dispatch(updateTask({
		id: task._id, 
		updatedTask: {
			...task, 
			completeStatus, 
			isCompleted
		}
	}));
}

const DraggableItem = ({id, index, children}) => {
	return (
		<Draggable index={index} draggableId={id}>
			{(provided, snapshot) => 
				<div
				className={`select-none font-semibold
				${snapshot.isDragging ?
					'bg-ivory text-gunmetal' : 
					'bg-blush text-ivory'} 
				rounded-lg p-2`}
				ref={provided.innerRef}
				{...provided.draggableProps}
				{...provided.dragHandleProps}
				>
					{children}
				</div>
			}
		</Draggable>
	)
}

const Column = ({title, id, children}) => {
	return (
		<div className='flex-1 flex flex-col gap-1 items-center'>
			<h2 className='font-bold border-2 border-slate-200 rounded-lg 
			w-full p-2 bg-blush text-ivory'>{title}</h2>
			<div className='flex-1 w-full rounded-lg relative'>
				<Droppable droppableId={id}>
				{(provided, snapshot) => 
					<div className={`p-3 absolute top-0 bottom-0 
					left-0 right-0 overflow-auto rounded-lg 
					flex flex-col gap-1
					${snapshot.isDraggingOver ?
					'bg-slate-400' : 'bg-gunmetal'}`}
					ref={provided.innerRef}
					{...provided.droppableProps}>
						{children}
						{provided.placeholder}
					</div>
				}
				</Droppable>
			</div>
		</div>
	)
}

const KanbanView  = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate()
	const tasks = useSelector(selectAllTasks);
	const project = useSelector(selectCurrentProject);
	const taskmaker = useSelector(selectTaskMaker);
	const taskeditor = useSelector(selectTaskEditor);
	const {name, ...rest} = project;
	const columns = {...rest};

    return (
        <div className={`flex-1 flex flex-col gap-2 items-center 
		bg-ivory text-gunmental p-2 
		${taskmaker.visible || taskeditor ? `cursor-not-allowed
		pointer-events-none contrast-50` : ''}`}>
            <DragDropContext 
			onDragEnd={taskmaker.visible || taskeditor ? null :
			result => 
			onDragEnd(result, tasks, columns, dispatch)}>
			<h1 className='text-xl font-bold italic '>{name}</h1>
			<div className='flex-1 w-full md:flex-row
			flex flex-col gap-2'>
			{Object.entries(columns).map(([columnId, column]) => 
				<Column id={columnId} title={column.title} key={columnId}>
					{column.items.map((item, index) =>
						<DraggableItem 
						key={item._id}
						id={item._id}
						index={index}>
							{<span className='flex flex-col'>
								<p>{item.title}</p>
								<p>Due: {format(new Date(item.end),
									 "yyyy-MM-dd 'at' HH:mm aa")}</p>
								<p className='self-end
								italic text-md cursor-pointer'
								onClick={() => {
									navigate(`/projects/${name}/task/${item._id}`);
									dispatch(toggleTaskEditor(true));
								}}>
								See more</p>
							</span>}
						</DraggableItem>
					)}
				</Column> 
			)}
			</div>
            </DragDropContext>
        </div>
    )
}

export default KanbanView 