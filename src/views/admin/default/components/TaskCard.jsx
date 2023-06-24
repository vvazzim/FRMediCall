import CardMenu from "components/card/CardMenu";
import React, { useState } from "react";
import Checkbox from "components/checkbox";
import { MdDragIndicator, MdCheckCircle } from "react-icons/md";
import Card from "components/card";

const TaskCard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'match', isCompleted: false },
    { id: 2, title: 'faire les courses', isCompleted: false },
    { id: 3, title: 'séance musculation', isCompleted: false },
  ]);

  const handleCheckboxChange = (taskId) => {
    setTasks(
        tasks.map(task =>
            task.id === taskId
                ? { ...task, isCompleted: !task.isCompleted }
                : task
        )
    );
  };

  return (
      <Card extra="pb-7 p-[20px]">
        <div className="relative flex flex-row justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-indigo-100 rounded-full h-9 w-9 dark:bg-indigo-100 dark:bg-white/5">
              <MdCheckCircle className="w-6 h-6 text-brand-500 dark:text-white" />
            </div>
            <h4 className="ml-4 text-xl font-bold text-navy-700 dark:text-white">
              Tasks
            </h4>
          </div>
          <CardMenu />
        </div>

        <div className="w-full h-full">
          {tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-2 mt-5">
                <div className="flex items-center justify-center gap-2">
                  <Checkbox checked={task.isCompleted} onChange={() => handleCheckboxChange(task.id)} />
                  <p className={`text-base font-bold ${task.isCompleted ? 'line-through' : ''} text-navy-700 dark:text-white`}>
                    {task.title}
                  </p>
                </div>
                <div>
                  <MdDragIndicator className="w-6 h-6 text-navy-700 dark:text-white" />
                </div>
              </div>
          ))}
        </div>
      </Card>
  );
};

export default TaskCard;