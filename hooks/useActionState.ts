import { useState } from "react";

export function useActionState<T>(
  action: (prevState: T, formData: FormData) => Promise<T>,
  initialState: T
): [T, (formData: FormData) => Promise<void>, boolean] {
  const [state, setState] = useState<T>(initialState);
  const [isPending, setIsPending] = useState(false);

  const formAction = async (formData: FormData) => {
    setIsPending(true);
    const newState = await action(state, formData);
    setState(newState);
    setIsPending(false);
  };

  return [state, formAction, isPending];
}
