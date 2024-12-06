import api from './api';
import { Event } from '../../types';
import { isAxiosError } from 'axios';

interface EventsResponse {
  status: string;
  data: Event[];
}

interface GetEventsParams {
  page?: number;
  perPage?: number;
}

export const getAllEvents = async ({ page = 1, perPage = 12 }: GetEventsParams = {}): Promise<EventsResponse> => {
  try {
    const response = await api.get(`/public/events?page=${page}&per_page=${perPage}`);
    return {
      status: 'success',
      data: response.data.data
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error('Error fetching events:', error.response);
      throw new Error(`Error: ${error.response.data.message}`);
    } else {
      console.error("An unknown error occurred");
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const getEvent = async (id: number) => {
  const response = await api.get(`/public/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData: FormData) => {
  const response = await api.post('/events', eventData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateEvent = async (id: number, eventData: FormData) => {
  const response = await api.put(`/events/${id}`, eventData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteEvent = async (id: number) => {
  await api.delete(`/events/${id}`);
};

export const filterEvents = async (filters: Record<string, any>) => {
  const response = await api.get('/events/filter', { params: filters });
  return response.data;
};
