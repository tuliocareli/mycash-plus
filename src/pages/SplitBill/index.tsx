import { useState } from 'react';
import { SplitRole, Expense } from './types';
import IntroScreen from './IntroScreen';
import RolesListScreen from './RolesListScreen';
import EmptyScreen from './EmptyScreen';
import CreateRoleScreen from './CreateRoleScreen';
import RoleDetailsScreen from './RoleDetailsScreen';
import AddExpenseScreen from './AddExpenseScreen';
import ResultScreen from './ResultScreen';

export type ScreenState = 
  | 'INTRO' 
  | 'EMPTY' 
  | 'LIST' 
  | 'CREATE' 
  | 'DETAILS' 
  | 'ADD_EXPENSE' 
  | 'RESULT';

export default function SplitBill() {
  const [screen, setScreen] = useState<ScreenState>('INTRO');
  const [roles, setRoles] = useState<SplitRole[]>([]);
  const [activeRole, setActiveRole] = useState<SplitRole | null>(null);

  // For navigating back correctly
  const handleBack = () => {
    switch (screen) {
      case 'EMPTY':
      case 'LIST':
      case 'CREATE':
        setScreen('INTRO');
        break;
      case 'DETAILS':
        setScreen(roles.length > 0 ? 'LIST' : 'EMPTY');
        break;
      case 'ADD_EXPENSE':
      case 'RESULT':
        setScreen('DETAILS');
        break;
      default:
        setScreen('INTRO');
    }
  };

  const handleRoleListCheck = () => {
    if (roles.length > 0) {
      setScreen('LIST');
    } else {
      setScreen('EMPTY');
    }
  };

  const onCreateRole = (newRole: SplitRole) => {
    setRoles([...roles, newRole]);
    setActiveRole(newRole);
    setScreen('DETAILS');
  };

  const onAddExpense = (expense: Expense) => {
    if (activeRole) {
      const updated = {
        ...activeRole,
        expenses: [...activeRole.expenses, expense]
      };
      setActiveRole(updated);
      setRoles(roles.map(r => r.id === updated.id ? updated : r));
    }
    setScreen('DETAILS');
  };

  const onDeleteRole = (id: string) => {
    const fresh = roles.filter(r => r.id !== id);
    setRoles(fresh);
    if (fresh.length > 0) {
      setScreen('LIST');
    } else {
      setScreen('EMPTY');
    }
  };

  const onDeleteExpense = (expId: string) => {
    if (activeRole) {
      const updated = {
        ...activeRole,
        expenses: activeRole.expenses.filter(e => e.id !== expId)
      };
      setActiveRole(updated);
      setRoles(roles.map(r => r.id === updated.id ? updated : r));
    }
  };

  return (
    <div className="w-full h-full min-h-[calc(100vh-80px)] flex flex-col pt-8 md:pt-0">
      {screen === 'INTRO' && (
        <IntroScreen 
          onCheckRoles={handleRoleListCheck} 
          onCreateNew={() => setScreen('CREATE')} 
        />
      )}
      
      {screen === 'EMPTY' && (
        <EmptyScreen 
          onCreateNew={() => setScreen('CREATE')} 
          onBack={handleBack} 
        />
      )}

      {screen === 'LIST' && (
        <RolesListScreen 
          roles={roles}
          onSelectRole={(role) => {
            setActiveRole(role);
            setScreen('DETAILS');
          }}
          onCreateNew={() => setScreen('CREATE')}
          onBack={handleBack}
        />
      )}

      {screen === 'CREATE' && (
        <CreateRoleScreen 
          onBack={handleBack} 
          onCreate={onCreateRole} 
        />
      )}

      {screen === 'DETAILS' && activeRole && (
        <RoleDetailsScreen 
          role={activeRole}
          onBack={handleBack}
          onAddExpense={() => setScreen('ADD_EXPENSE')}
          onCalculate={() => setScreen('RESULT')}
          onDeleteRole={() => onDeleteRole(activeRole.id)}
          onDeleteExpense={onDeleteExpense}
        />
      )}

      {screen === 'ADD_EXPENSE' && activeRole && (
        <AddExpenseScreen 
          role={activeRole} 
          onBack={handleBack}
          onSave={onAddExpense}
        />
      )}

      {screen === 'RESULT' && activeRole && (
        <ResultScreen 
          role={activeRole} 
          onBack={handleBack} 
        />
      )}
    </div>
  );
}
