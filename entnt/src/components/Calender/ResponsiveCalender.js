import * as React from "react";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { Button, Grid, Typography, Box, Tooltip, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";


function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function fakeFetch(date, { signal }) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysInMonth = date.daysInMonth();
      const daysToHighlight = Array.from({ length: 5 }, () =>
        getRandomNumber(1, daysInMonth)
      );

      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException("aborted", "AbortError"));
    };
  });
}

const initialValue = dayjs();

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  const isSelected =
    !outsideCurrentMonth && highlightedDays.indexOf(day.date()) >= 0;

  return (
    <Tooltip title={isSelected ? "View Orders" : "No Orders"}>
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={isSelected ? "🌟" : undefined}
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: isSelected ? "#4caf50" : undefined,
            color: isSelected ? "#fff" : undefined,
          },
        }}
      >
        <PickersDay
          {...other}
          day={day}
          sx={{
            backgroundColor: isSelected ? "#f0f4c3" : undefined,
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "#c5e1a5",
            },
          }}
        />
      </Badge>
    </Tooltip>
  );
}

export default function InteractiveCalendar() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([]);
  const requestAbortController = React.useRef(null);

  const fetchHighlightedDays = (date) => {
    const controller = new AbortController();
    fakeFetch(date, { signal: controller.signal })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  React.useEffect(() => {
    fetchHighlightedDays(initialValue);
    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", margin: 10 }}>
        <Button
          variant="contained"
          onClick={handleClick}
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Home
        </Button>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              margin: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 3,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Calendar Dashboard
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                defaultValue={initialValue}
                loading={isLoading}
                onMonthChange={handleMonthChange}
                renderLoading={() => <DayCalendarSkeleton />}
                slots={{
                  day: ServerDay,
                }}
                slotProps={{
                  day: {
                    highlightedDays,
                  },
                }}
                sx={{
                  width: "100%",
                  height: 600,
                  "& .MuiPickersCalendarHeader-root": {
                    backgroundColor: "#1976d2",
                    color: "#fff",
                  },
                  "& .MuiDayCalendar-weekContainer": {
                    "& .MuiPickersDay-root": {
                      "&.Mui-selected": {
                        backgroundColor: "#4caf50",
                        color: "#fff",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              backgroundColor: "#e3f2fd",
              borderRadius: 3,
              margin: 2,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Orders Summary
            </Typography>
            <Box sx={{ padding: 2, backgroundColor: "#bbdefb", borderRadius: 2 }}>
              <Typography>Total Orders: 25</Typography>
              <Typography>Pending: 8</Typography>
              <Typography>Completed: 17</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="h6">Order Details</Typography>
              <ul>
                {highlightedDays.map((day) => (
                  <li key={day}>Day {day}: Orders Available</li>
                ))}
              </ul>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
