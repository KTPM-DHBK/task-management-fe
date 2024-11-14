import { CircularProgress, Slide } from "@mui/material";
import React, { useEffect, useState } from "react";
import ActivityItem from "./ActivityItem";
import { getActivities } from "../../../Services/API/ApiBoard/apiBoard";
import { useParams } from "react-router-dom";

export default function Activities() {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  const { idBoard } = useParams();

  useEffect(() => {
    getActivities(idBoard)
      .then((res) => {
        setActivities(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [idBoard]);
  return (
    <Slide in={true} direction="left">
      <div className="flex flex-col">
        {isLoading && (
          <div className="flex justify-center">
            <CircularProgress size={20} />
          </div>
        )}
        <div>
          {activities.map((act, index) => (
            <ActivityItem data={act} key={index} />
          ))}
        </div>
      </div>
    </Slide>
  );
}
