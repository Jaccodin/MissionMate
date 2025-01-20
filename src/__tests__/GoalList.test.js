import { render, screen } from '@testing-library/react';
import GoalList from '../components/GoalList';

test('renders goal list', () => {
  const goals = [{ id: 1, title: 'Learn React' }];
  render(<GoalList goals={goals} />);
  expect(screen.getByText('Learn React')).toBeInTheDocument();
});
