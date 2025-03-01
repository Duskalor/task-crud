export const InputError = ({ message }: { message: string }) => {
  return (
    <div className='flex items-center gap-2 p-3 mt-2 text-sm font-medium text-red-700 bg-red-100 rounded-md border border-red-200 shadow-sm'>
      {/* Ícono de advertencia */}
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='w-5 h-5 text-red-500'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1z'
          clipRule='evenodd'
        />
      </svg>
      {/* Mensaje de error */}
      <p>{message}</p>
    </div>
  );
};
