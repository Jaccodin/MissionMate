import React from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const GoalForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} placeholder="Goal Title" />
      <DatePicker {...register('dueDate')} placeholderText="Due Date" />
      <button type="submit">Create Goal</button>
    </form>
  );
};

export default GoalForm;
