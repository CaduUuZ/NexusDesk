import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketAPI } from '../services/api';

export function useTickets(params) {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketAPI.list(params).then(r => r.data),
  });
}

export function useTicket(id) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketAPI.get(id).then(r => r.data),
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => ticketAPI.create(data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets'] }),
  });
}

export function useUpdateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => ticketAPI.update(id, data).then(r => r.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['tickets'] });
      qc.invalidateQueries({ queryKey: ['ticket', data.id] });
    },
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => ticketAPI.dashboard().then(r => r.data),
  });
}
