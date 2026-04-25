import { useState, useEffect } from 'react';
import { SplitRole, Expense } from './types';
import IntroScreen from './IntroScreen';
import RolesListScreen from './RolesListScreen';
import EmptyScreen from './EmptyScreen';
import CreateRoleScreen from './CreateRoleScreen';
import RoleDetailsScreen from './RoleDetailsScreen';
import AddExpenseScreen from './AddExpenseScreen';
import ResultScreen from './ResultScreen';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';

export type ScreenState =
  | 'INTRO'
  | 'EMPTY'
  | 'LIST'
  | 'CREATE'
  | 'EDIT'
  | 'DETAILS'
  | 'ADD_EXPENSE'
  | 'RESULT';

export default function SplitBill() {
  const { user } = useAuth();
  const [screen, setScreen] = useState<ScreenState>('INTRO');
  const [roles, setRoles] = useState<SplitRole[]>([]);
  const [activeRole, setActiveRole] = useState<SplitRole | null>(null);

  // Sync with Supabase on mount or user change
  useEffect(() => {
    const fetchRoles = async () => {
      // Offline fallback
      const saved = localStorage.getItem('@purso-split-roles');
      let localRoles: SplitRole[] = [];
      if (saved) {
        try { localRoles = JSON.parse(saved); } catch (e) { }
      }
      
      if (!user) {
        setRoles(localRoles);
        return;
      }

      // Fetch from Supabase
      const { data, error } = await supabase
        .from('split_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        setRoles(localRoles);
      } else {
        // Map from DB format back to UI format
        const dbRoles = data.map(dbRow => ({
          ...dbRow,
          participants: dbRow.participants || [],
          expenses: dbRow.expenses || [],
        })) as SplitRole[];
        
        setRoles(dbRoles);
        localStorage.setItem('@purso-split-roles', JSON.stringify(dbRoles));
      }
    };
    
    fetchRoles();
  }, [user]);

  // Sync a single role mutation up to DB
  const upsertToDatabase = async (role: SplitRole) => {
    if (!user) return;
    try {
        await supabase.from('split_roles').upsert({
            id: role.id,
            user_id: user.id,
            title: role.title,
            date: role.date,
            emoji: role.emoji,
            participants: role.participants,
            expenses: role.expenses,
            created_at: role.createdAt
        });
    } catch (e) {}
  };

  const deleteFromDatabase = async (id: string) => {
    if (!user) return;
    try {
        await supabase.from('split_roles').delete().eq('id', id);
    } catch(e) {}
  };

  const updateRolesStateAndLocal = (newRoles: SplitRole[]) => {
    setRoles(newRoles);
    localStorage.setItem('@purso-split-roles', JSON.stringify(newRoles));
  };

  const handleBack = () => {
    switch (screen) {
      case 'EMPTY':
      case 'LIST':
      case 'CREATE':
        setScreen('INTRO');
        break;
      case 'EDIT':
        setScreen('LIST');
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

  const onCreateRole = async (newRole: SplitRole) => {
    updateRolesStateAndLocal([...roles, newRole]);
    setActiveRole(newRole);
    setScreen('DETAILS');
    await upsertToDatabase(newRole);
  };

  const onUpdateRole = async (updatedRole: SplitRole) => {
    updateRolesStateAndLocal(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
    setActiveRole(updatedRole);
    setScreen('LIST');
    await upsertToDatabase(updatedRole);
  };

  const onAddExpense = async (expense: Expense) => {
    if (activeRole) {
      const updated = {
        ...activeRole,
        expenses: [...activeRole.expenses, expense]
      };
      setActiveRole(updated);
      updateRolesStateAndLocal(roles.map(r => r.id === updated.id ? updated : r));
      setScreen('DETAILS');
      await upsertToDatabase(updated);
    }
  };

  const onDeleteRole = async (id: string) => {
    const fresh = roles.filter(r => r.id !== id);
    updateRolesStateAndLocal(fresh);
    if (fresh.length > 0) {
      setScreen('LIST');
    } else {
      setScreen('EMPTY');
    }
    await deleteFromDatabase(id);
  };

  const onDeleteExpense = async (expId: string) => {
    if (activeRole) {
      const updated = {
        ...activeRole,
        expenses: activeRole.expenses.filter(e => e.id !== expId)
      };
      setActiveRole(updated);
      updateRolesStateAndLocal(roles.map(r => r.id === updated.id ? updated : r));
      await upsertToDatabase(updated);
    }
  };

  const onFinishResult = () => {
    setScreen('LIST');
  };

  return (
    <div className="w-full h-full min-h-[calc(100vh-80px)] flex flex-col pt-8 md:pt-4 px-4 md:px-8">
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
          onEditRole={(role) => {
            setActiveRole(role);
            setScreen('EDIT');
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

      {screen === 'EDIT' && activeRole && (
        <CreateRoleScreen
          roleToEdit={activeRole}
          onBack={handleBack}
          onCreate={onUpdateRole}
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
          onFinish={onFinishResult}
        />
      )}
    </div>
  );
}
