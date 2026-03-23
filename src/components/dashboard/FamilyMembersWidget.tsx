import clsx from 'clsx';
import { User, Plus, Check } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { useInteractionTracker } from '../../hooks/useAnalytics';

export function FamilyMembersWidget({ onOpenAddMember }: { onOpenAddMember?: () => void }) {
    const { familyMembers, selectedMemberId, setSelectedMemberId } = useFinance();
    const { trackClick: trackMemberClick } = useInteractionTracker('family_member_filter');
    const { trackClick: trackAddMember } = useInteractionTracker('add_member_button');

    const handleMemberClick = (id: string, name: string) => {
        const isDeselecting = selectedMemberId === id;
        trackMemberClick({ member_name: name, action: isDeselecting ? 'deselect' : 'select' });
        if (isDeselecting) {
            setSelectedMemberId(null);
        } else {
            setSelectedMemberId(id);
        }
    };

    return (
        <div className="flex items-center -space-x-2 lg:-space-x-3">
            {familyMembers.map((member) => {
                const isSelected = selectedMemberId === member.id;

                return (
                    <button
                        key={member.id}
                        onClick={() => handleMemberClick(member.id, member.name)}
                        className={clsx(
                            "relative size-9 lg:size-11 rounded-full border-2 transition-all duration-300 ease-out overflow-visible group",
                            isSelected
                                ? "border-neutral-1100 z-20 scale-105"
                                : "border-white hover:z-10 hover:scale-110 hover:-translate-y-1"
                        )}
                        title={member.name}
                    >
                        {/* Avatar Image */}
                        <div className="w-full h-full rounded-full overflow-hidden bg-neutral-200">
                            {member.avatarUrl ? (
                                <img
                                    src={member.avatarUrl}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full text-neutral-500">
                                    <User size={16} />
                                </div>
                            )}
                        </div>

                        {/* Selected Indicator */}
                        {isSelected && (
                            <div className="absolute -bottom-1 -right-1 bg-brand-500 text-neutral-1100 p-0.5 rounded-full border border-white shadow-sm animate-scale-in">
                                <Check size={12} strokeWidth={3} />
                            </div>
                        )}
                    </button>
                );
            })}

            {/* Add Member Button - Mock Action */}
            <button
                className="relative size-9 lg:size-11 rounded-full bg-neutral-100 hover:bg-neutral-200 border-2 border-white flex items-center justify-center text-neutral-500 transition-colors z-0"
                title="Adicionar Membro"
                onClick={() => {
                    trackAddMember();
                    onOpenAddMember?.();
                }}
            >
                <Plus size={20} />
            </button>
        </div>
    );
}
