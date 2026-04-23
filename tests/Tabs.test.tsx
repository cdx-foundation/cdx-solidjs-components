import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../lib/ui/Tabs';

describe('Tabs', () => {
  it('renders and switches content using compound component pattern', () => {
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
});
