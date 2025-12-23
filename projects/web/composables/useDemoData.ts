const firstNames = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eva', 'Frank', 'Grace', 'Henry',
  'Iris', 'Jack', 'Kate', 'Leo', 'Mia', 'Noah', 'Olivia', 'Peter',
  'Quinn', 'Rachel', 'Sam', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xavier',
  'Yara', 'Zack', 'Amy', 'Ben', 'Claire', 'Dan', 'Emma', 'Felix',
  'Gina', 'Hugo', 'Ivy', 'James', 'Kylie', 'Liam', 'Maya', 'Nick'
];

const lastNames = [
  'Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Fischer', 'Garcia', 'Harris',
  'Ivanov', 'Johnson', 'Kim', 'Lee', 'Martinez', 'Nguyen', 'O\'Brien', 'Patel',
  'Quinn', 'Rodriguez', 'Smith', 'Taylor', 'Ueda', 'Vargas', 'Wilson', 'Xu',
  'Yang', 'Zhang', 'Abbott', 'Barnes', 'Cooper', 'Diaz', 'Edwards', 'Foster',
  'Green', 'Hill', 'Ibrahim', 'Jones', 'Khan', 'Lopez', 'Miller', 'Nelson'
];

let initialized = false;

export const useDemoData = () => {
  const { addUser } = useUserStore();
  const { addEvent } = useEventStore();

  const initializeDemo = () => {
    if (initialized) return;

    for (let i = 0; i < 40; i++) {
      addUser(`${firstNames[i]} ${lastNames[i]}`);
    }

    const participantIds = Array.from({ length: 40 }, (_, i) => i + 1);
    const tableIds = Array.from({ length: 10 }, (_, i) => i + 1);

    addEvent({
      name: 'Klikkmentes December 2025',
      startedAt: 0,
      participantIds,
      tableIds
    });

    initialized = true;
  };

  return {
    initializeDemo
  };
};
