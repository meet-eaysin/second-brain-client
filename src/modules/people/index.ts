// People module exports
export { PeoplePage } from './pages/people-page';

// Components
export { PersonCard } from './components/person-card';
export { PersonList } from './components/person-list';
export { PersonForm } from './components/person-form';
export { ContactDetails } from './components/contact-details';
export { InteractionHistory } from './components/interaction-history';
export { PeopleStats } from './components/people-stats';

// Types
export type * from './types/people.types';

// Hooks
export { usePeopleQuery } from './hooks/use-people-query';
export { useCreatePerson } from './hooks/use-create-person';
export { useUpdatePerson } from './hooks/use-update-person';
export { useInteractions } from './hooks/use-interactions';

// Services
export { peopleApi } from './services/people-api';

// Context
export { PeopleProvider, usePeopleContext } from './context/people-context';

// Routes
export { peopleRoutes } from './routes/people-routes';
