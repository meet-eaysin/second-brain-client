import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Target,
  Zap,
  Users,
  Play,
  Pause,
  Square,
} from "lucide-react";
import { secondBrainApi } from "../services/second-brain-api";
import { toast } from "sonner";

interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  type: "task" | "project" | "habit" | "meeting" | "focus" | "break";
  linkedItem?: string;
  color?: string;
  status: "planned" | "in-progress" | "completed" | "cancelled";
}

interface TimeBlockingCalendarProps {
  view?: "day" | "week";
  onBlockClick?: (block: TimeBlock) => void;
}

export function TimeBlockingCalendar({
  view = "day",
}: TimeBlockingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBlock, setNewBlock] = useState<Partial<TimeBlock>>({
    type: "focus",
    status: "planned",
  });
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [pomodoroTimer, setPomodoroTimer] = useState<{
    isRunning: boolean;
    timeLeft: number;
    blockId?: string;
  }>({ isRunning: false, timeLeft: 25 * 60 });

  const queryClient = useQueryClient();

  // Fetch time blocks and related data
  const { data: calendarData, isLoading } = useQuery({
    queryKey: ["second-brain", "time-blocks", currentDate.toDateString(), view],
    queryFn: async () => {
      const startDate =
        view === "week"
          ? new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate() - currentDate.getDay()
            )
          : new Date(currentDate);

      const endDate =
        view === "week"
          ? new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000)
          : new Date(currentDate);

      const [timeBlocks, tasks, projects, habits] = await Promise.all([
        // In a real app, this would fetch time blocks from the API
        Promise.resolve({ data: { timeBlocks: [] } }),
        secondBrainApi.tasks.getAll({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
        secondBrainApi.projects.getAll(),
        secondBrainApi.habits.getAll(),
      ]);

      return { timeBlocks, tasks, projects, habits };
    },
  });

  const createTimeBlockMutation = useMutation({
    mutationFn: async (block: Partial<TimeBlock>) => {
      // In a real app, this would create a time block via API
      return Promise.resolve({ data: { ...block, id: Date.now().toString() } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["second-brain", "time-blocks"],
      });
      toast.success("Time block created successfully");
      setIsCreateDialogOpen(false);
      setNewBlock({ type: "focus", status: "planned" });
    },
  });

  // const updateTimeBlockMutation = useMutation({
  //     mutationFn: async ({ id, updates }: { id: string; updates: Partial<TimeBlock> }) => {
  //         // In a real app, this would update a time block via API
  //         return Promise.resolve({ data: { id, ...updates } });
  //     },
  //     onSuccess: () => {
  //         queryClient.invalidateQueries({ queryKey: ['second-brain', 'time-blocks'] });
  //         toast.success('Time block updated successfully');
  //     }
  // });

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push({
          time: `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`,
          hour,
          minute,
        });
      }
    }
    return slots;
  };

  const getDaysToShow = () => {
    if (view === "day") {
      return [currentDate];
    } else {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
      });
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent, date: Date, time: string) => {
      e.preventDefault();

      if (draggedTask) {
        const [hour, minute] = time.split(":").map(Number);
        const startTime = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const endTime = `${(hour + 1).toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;

        const block: Partial<TimeBlock> = {
          title: draggedTask.title,
          startTime,
          endTime,
          date: date.toISOString().split("T")[0],
          type: "task",
          linkedItem: draggedTask._id,
          status: "planned",
        };

        createTimeBlockMutation.mutate(block);
        setDraggedTask(null);
      }
    },
    [draggedTask, createTimeBlockMutation]
  );

  // const getBlockColor = (type: string) => {
  //     switch (type) {
  //         case 'task': return 'bg-blue-500';
  //         case 'project': return 'bg-green-500';
  //         case 'habit': return 'bg-purple-500';
  //         case 'meeting': return 'bg-orange-500';
  //         case 'focus': return 'bg-indigo-500';
  //         case 'break': return 'bg-gray-500';
  //         default: return 'bg-blue-500';
  //     }
  // };

  const startPomodoro = (blockId?: string) => {
    setPomodoroTimer({
      isRunning: true,
      timeLeft: 25 * 60,
      blockId,
    });

    // Start countdown
    const interval = setInterval(() => {
      setPomodoroTimer((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(interval);
          toast.success("Pomodoro completed!");
          return { isRunning: false, timeLeft: 25 * 60 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const timeSlots = getTimeSlots();
  const daysToShow = getDaysToShow();
  const data = calendarData || {
    tasks: [],
    projects: [],
    habits: [],
    timeBlocks: [],
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Time Blocking
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium min-w-[200px] text-center">
              {view === "day"
                ? currentDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                : `Week of ${daysToShow[0].toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Pomodoro Timer */}
          <Card className="p-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-sm">
                {formatTime(pomodoroTimer.timeLeft)}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  pomodoroTimer.isRunning
                    ? setPomodoroTimer((prev) => ({
                        ...prev,
                        isRunning: false,
                      }))
                    : startPomodoro()
                }
              >
                {pomodoroTimer.isRunning ? (
                  <Pause className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
              </Button>
            </div>
          </Card>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Block
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[600px]">
                {/* Header */}
                <div
                  className={`grid ${
                    view === "day" ? "grid-cols-2" : "grid-cols-8"
                  } border-b sticky top-0 bg-background`}
                >
                  <div className="p-2 border-r text-xs text-muted-foreground">
                    Time
                  </div>
                  {daysToShow.map((day) => (
                    <div
                      key={day.toISOString()}
                      className="p-2 border-r text-center"
                    >
                      <div className="text-xs text-muted-foreground">
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div
                        className={`text-lg font-medium ${
                          day.toDateString() === new Date().toDateString()
                            ? "text-primary"
                            : ""
                        }`}
                      >
                        {day.getDate()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Grid */}
                {timeSlots.map((slot) => (
                  <div
                    key={slot.time}
                    className={`grid ${
                      view === "day" ? "grid-cols-2" : "grid-cols-8"
                    } border-b h-12`}
                  >
                    <div className="p-2 border-r text-xs text-muted-foreground">
                      {slot.time}
                    </div>
                    {daysToShow.map((day) => (
                      <div
                        key={`${day.toISOString()}-${slot.time}`}
                        className="border-r relative hover:bg-muted/50 cursor-pointer"
                        onDrop={(e) => handleDrop(e, day, slot.time)}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => {
                          setNewBlock({
                            ...newBlock,
                            date: day.toISOString().split("T")[0],
                            startTime: slot.time,
                            endTime: `${(slot.hour + 1)
                              .toString()
                              .padStart(2, "0")}:${slot.minute
                              .toString()
                              .padStart(2, "0")}`,
                          });
                          setIsCreateDialogOpen(true);
                        }}
                      >
                        {/* Time blocks would be rendered here */}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Available Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Available Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.tasks?.slice(0, 5).map((task: any) => (
                <div
                  key={task._id}
                  className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-muted/50"
                  draggable
                  onDragStart={() => setDraggedTask(task)}
                >
                  <CheckSquare className="h-4 w-4 text-blue-500" />
                  <span className="text-sm truncate">{task.title}</span>
                  {task.priority === "high" && (
                    <Badge variant="destructive" className="text-xs">
                      High
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Habits */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Today's Habits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.habits?.slice(0, 3).map((habit: any) => (
                <div
                  key={habit._id}
                  className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-muted/50"
                  draggable
                  onDragStart={() =>
                    setDraggedTask({ ...habit, type: "habit" })
                  }
                >
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span className="text-sm truncate">{habit.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {habit.frequency}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Target className="h-4 w-4" />
                Focus Session
              </Button>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Users className="h-4 w-4" />
                Meeting
              </Button>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Square className="h-4 w-4" />
                Break
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Time Block Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Time Block</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Time block title"
                value={newBlock.title || ""}
                onChange={(e) =>
                  setNewBlock((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Time</label>
                <Input
                  type="time"
                  value={newBlock.startTime || ""}
                  onChange={(e) =>
                    setNewBlock((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Time</label>
                <Input
                  type="time"
                  value={newBlock.endTime || ""}
                  onChange={(e) =>
                    setNewBlock((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={newBlock.type}
                onValueChange={(value) =>
                  setNewBlock((prev) => ({ ...prev, type: value as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="focus">Focus Work</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="break">Break</SelectItem>
                  <SelectItem value="habit">Habit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => createTimeBlockMutation.mutate(newBlock)}
                disabled={
                  !newBlock.title || !newBlock.startTime || !newBlock.endTime
                }
              >
                Create Block
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
