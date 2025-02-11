'use client'; // Necesario para usar useRouter

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RedirectComponent() {
  const router = useRouter();

  useEffect(() => {
    // Redirige a "/dashboard" sin agregar "/" al historial
    router.replace('/dashboard');
  }, [router]);

  return null; // O un componente de carga si lo deseas
}
