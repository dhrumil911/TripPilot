import { Request, Response } from 'express';

/**
 * Health check handler to confirm backend api is running.
 */
export const getHealth = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'TripPilot API is running'
  });
};
