import { type Dispatch, type SetStateAction } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { getPeakHours, getStats, getTimeline } from '@/queries/analytics';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Activity, Calendar, Clock, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';

interface AnalyticsDialogProps {
  formId: string | undefined;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function AnalyticsDialog({
  formId,
  open,
  setOpen,
}: AnalyticsDialogProps) {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['analytics', 'stats', formId],
    queryFn: () => getStats(formId as string),
    enabled: open && !!formId,
  });

  const { data: timeline, isLoading: timelineLoading } = useQuery({
    queryKey: ['analytics', 'timeline', formId],
    queryFn: () => getTimeline(formId as string),
    enabled: open && !!formId,
  });

  const { data: peakHours, isLoading: peakHoursLoading } = useQuery({
    queryKey: ['analytics', 'peak-hours', formId],
    queryFn: () => getPeakHours(formId as string),
    enabled: open && !!formId,
  });

  const formattedTimeline = timeline
    ? Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i)); // Start from 30 days ago
        const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        const existingData = timeline.find((item) => item._id === dateString);
        return {
          _id: dateString,
          count: existingData?.count || 0,
        };
      })
    : [];

  const formattedPeakHours = peakHours
    ? Array.from({ length: 24 }, (_, hour) => {
        const existingData = peakHours.find((item) => item._id === hour);
        return {
          _id: hour,
          count: existingData?.count || 0,
        };
      })
    : [];

  const isLoading = statsLoading || peakHoursLoading || timelineLoading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Additional details</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Loading analytics...</p>
            </div>
          </div>
        )}

        {!isLoading && (
          <div className="space-y-6">
            {stats && (
              <div className="grid grid-cols-1 grid-rows-[90px] sm:grid-cols-2 gap-4">
                <Card className="gap-0 pb-2 pt-4">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Activity size={16} />
                      Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.total}</div>
                  </CardContent>
                </Card>

                <Card className="gap-0 pb-2 pt-4">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Clock size={16} />
                      Last 24h
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.last24h}</div>
                  </CardContent>
                </Card>

                <Card className="gap-0 pb-2 pt-4">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Calendar size={16} />
                      Last 7d
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.last7d}</div>
                  </CardContent>
                </Card>

                <Card className="gap-0 pb-2 pt-4">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <TrendingUp size={16} />
                      Avg/Day
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.avgPerDay}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card className="gap-1 pb-2">
              <CardHeader>
                <CardTitle>Peak Hours</CardTitle>
              </CardHeader>
              <CardContent className="pl-0">
                {formattedPeakHours && formattedPeakHours.length > 0 ? (
                  <ChartContainer
                    config={{
                      _id: {},
                      count: {
                        label: 'Submissions',
                        color: '#8b5cf6',
                      },
                    }}
                    className="h-37.5 w-full"
                  >
                    <BarChart
                      data={formattedPeakHours}
                      margin={{ left: 25, right: 5 }}
                    >
                      <XAxis
                        dataKey="_id"
                        tick={false}
                        label={{
                          value: 'Hour of Day',
                          position: 'insideBottom',
                          offset: 5,
                        }}
                      />
                      <YAxis width={0} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            labelKey="_id"
                            hideLabel={false}
                            labelFormatter={(_, payload) => {
                              const hour = payload?.[0]?.payload?._id;
                              return hour !== undefined
                                ? `Hour: ${hour}:00`
                                : '';
                            }}
                          />
                        }
                      />
                      <Bar dataKey="count" fill="#8b5cf6" name="Submissions" />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="gap-1 pb-2">
              <CardHeader>
                <CardTitle>Submissions Over Time (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent className="pl-0">
                {formattedTimeline && formattedTimeline.length > 0 ? (
                  <ChartContainer
                    config={{
                      count: {
                        label: 'Submissions',
                        color: '#3b82f6',
                      },
                    }}
                    className="h-37.5 w-full"
                  >
                    <BarChart
                      data={formattedTimeline}
                      margin={{ left: 25, right: 5 }}
                    >
                      <XAxis
                        tick={false}
                        dataKey="_id"
                        label={{
                          value: 'Date',
                          position: 'insideBottom',
                          offset: 5,
                        }}
                      />
                      <YAxis width={0} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            labelFormatter={(value) => value}
                          />
                        }
                      />
                      <Bar dataKey="count" fill="#3b82f6" name="Submissions" />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${import.meta.env.VITE_API_URL}/api/forms/${formId}`,
                );
                setOpen(false);
              }}
            >
              Copy form link
            </Button>
          </DialogClose>
          <Button type="button" className="min-w-25" variant="destructive">
            Delete form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
