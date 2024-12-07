import { api } from './api';
import { Event } from '../../types';
import { isAxiosError } from 'axios';

interface EventsResponse {
  status: string;
  data: {
    data: Event[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

interface GetEventsParams {
  page?: number;
  perPage?: number;
  filters?: {
    search?: string;
  };
}

export const getAllEvents = async ({ page = 1, perPage = 12, filters }: GetEventsParams = {}): Promise<EventsResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('per_page', perPage.toString());

    if (filters?.search) {
      params.append('search', filters.search);
    }

    const response = await api.get(`/api/v1/public/events?${params.toString()}`);
    return {
      status: 'success',
      data: response.data
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

export const getEvent = async (id: number): Promise<{ status: string; data: Event }> => {
  try {
    const response = await api.get(`/api/v1/public/events/${id}`);
    return {
      status: 'success',
      data: response.data.data
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error('Error fetching event:', error.response);
      throw new Error(`Error: ${error.response.data.message}`);
    } else {
      console.error("An unknown error occurred");
      throw new Error('An unexpected error occurred.');
    }
  }
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
