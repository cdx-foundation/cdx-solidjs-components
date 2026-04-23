import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';

describe('Tabs', () => {
  it('renders and switches content', () => {
    render(() => (
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Trigger 1</TabsTrigger>
          <TabsTrigger value="tab2">Trigger 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    ));

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Trigger 2'));

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('has correct ARIA roles', () => {
    render(() => (
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Trigger 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    ));

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('renders triggers automatically from items prop', () => {
    const items = [
      { id: 't1', label: 'Tab 1' },
      { id: 't2', label: 'Tab 2' },
    ];
    render(() => <Tabs items={items} activeTab="t1" />);

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 1')).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onTabChange when a shorthand tab is clicked', () => {
    const items = [
      { id: 't1', label: 'Tab 1' },
      { id: 't2', label: 'Tab 2' },
    ];
    const onTabChange = vi.fn();
    render(() => <Tabs items={items} onTabChange={onTabChange} />);

    fireEvent.click(screen.getByText('Tab 2'));
    expect(onTabChange).toHaveBeenCalledWith('t2');
  });
});
