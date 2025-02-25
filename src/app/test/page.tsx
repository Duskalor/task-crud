import { MoreVertical } from 'lucide-react';

//  task_id: string;
//   name: string;
//   description: string;
//   status: { name: string }

export const tasksExample = [
  {
    task_id: '1',
    name: 'Aprender inglés',
    description: 'lo básico para poder comunicarse',
    status: { name: 'to do' },
  },
  {
    task_id: '2',
    name: 'Estudiar bienes raíces',
    description: 'cómo funciona el mercado y sus procesos',
    status: { name: 'in_progress' },
  },
  {
    task_id: '3',
    name: 'Practicar Programación',
    description: 'crear nuevas aplicaciones con ReactJS',
    status: { name: 'done' },
  },
  {
    task_id: '4',
    name: 'Practicar Labia',
    description: 'aprender a generar una conversación',
    status: { name: 'in_progress' },
  },
  {
    task_id: '5',
    name: 'Aprender a escribir',
    description: 'no tener fallas ortográficas',
    status: { name: 'in_progress' },
  },
  {
    task_id: '6',
    name: 'Leer sobre política',
    description: 'saber el estado político de mi país',
    status: { name: 'done' },
  },
];

const statusColors = {
  'to do': 'bg-red-500 text-white',
  in_progress: 'bg-yellow-500 text-white',
  done: 'bg-green-500 text-white',
};

export default function page() {
  return (
    <div className='max-w-2xl mx-auto mt-10'>
      <div className='overflow-hidden rounded-lg shadow-lg bg-white'>
        <table className='w-full'>
          <thead className='bg-gray-100'>
            <tr className='text-left'>
              <th className='px-6 py-4 font-semibold text-gray-700'>Task</th>
              <th className='px-6 py-4 font-semibold text-gray-700 text-center'>
                Status
              </th>
              <th className='px-6 py-4 font-semibold text-gray-700 text-center'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasksExample.map((task, index) => (
              <tr key={index} className='border-b hover:bg-gray-50 transition'>
                <td className='px-6 py-4'>
                  <p className='font-semibold text-gray-900'>{task.name}</p>
                  <p className='text-gray-500 text-sm'>{task.description}</p>
                </td>
                <td className='px-6 py-4 text-center'>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusColors[task.status.name]
                    }`}
                  >
                    {task.status.name}
                  </span>
                </td>
                <td className='px-6 py-4 text-center'>
                  <button className='p-2 text-gray-600 hover:bg-gray-200 rounded-full transition'>
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
