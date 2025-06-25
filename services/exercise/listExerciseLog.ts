// services/exercise/listLogsThisWeek.ts
import { ExerciseLog } from "@/types/health/exercise";
import api from "../api";

export const getExerciseLogs = async (): Promise<ExerciseLog[]> => {
  try {
    const response = await api.get<ExerciseLog[]>("physical/exercise/log/");
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Erro ao tentar buscar registros de exercício.");
  }
};
