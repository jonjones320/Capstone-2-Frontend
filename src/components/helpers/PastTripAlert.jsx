import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { format } from 'date-fns';

const PastTripAlert = ({ startDate, endDate, onEdit }) => {
  const today = new Date();
  const tripStart = new Date(startDate);
  const tripEnd = new Date(endDate);
  const isPast = tripEnd < today;
  const isOngoing = tripStart <= today && tripEnd >= today;

  if (!isPast && !isOngoing) return null;

  return (
    <Alert variant={isPast ? "warning" : "info"} className="mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-medium">
            {isPast ? "Past Trip" : "Ongoing Trip"}
          </h4>
          <p className="mt-1">
            {isPast 
              ? "This trip has already ended. You'll need to update the dates to search for new flights." 
              : `This trip is currently in progress (${format(tripStart, 'MMM d')} - ${format(tripEnd, 'MMM d')})`}
          </p>
        </div>
        {isPast && (
          <Button 
            onClick={onEdit}
            variant="outline"
            className="ml-4"
          >
            Update Dates
          </Button>
        )}
      </div>
    </Alert>
  );
};

export default PastTripAlert;