import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CreditCard,
  Package,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  Send,
  Sparkles,
  School,
  ExternalLink,
  Scan,
  ShieldCheck,
  Lock,
  User,
} from 'lucide-react';
import { ExtractedNotice, SchoolNoticeItem, TaskCategory, TaskPriority } from '../types';
import { RedactionShieldModal } from './RedactionShieldModal';
import { useTranslation } from '../i18n/LanguageContext';

interface TasksReviewProps {
  notice: ExtractedNotice;
  onUpdateNotice: (updated: ExtractedNotice) => void;
  onInitiateSync: () => void;
  onBack: () => void;
  isAuthenticated: boolean;
  onGoogleSignIn: () => void;
  selectedListTitle: string;
}

export const TasksReview: React.FC<TasksReviewProps> = ({
  notice,
  onUpdateNotice,
  onInitiateSync,
  onBack,
  isAuthenticated,
  onGoogleSignIn,
  selectedListTitle,
}) => {
  const { t } = useTranslation();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');
  const [editedNotes, setEditedNotes] = useState('');
  const [editedPriority, setEditedPriority] = useState<TaskPriority>('normal');
  const [editedCategory, setEditedCategory] = useState<TaskCategory>('other');

  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState(notice.due_date || '');
  const [newCategory, setNewCategory] = useState<TaskCategory>('paperwork');
  const [newPriority, setNewPriority] = useState<TaskPriority>('normal');

  const [showOriginalNotice, setShowOriginalNotice] = useState(false);
  const [showShieldModal, setShowShieldModal] = useState(false);

  // Toggle selection of a task
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = notice.tasks.map((t) => (t.id === taskId ? { ...t, selected: !t.selected } : t));
    onUpdateNotice({ ...notice, tasks: updatedTasks });
  };

  // Toggle select all
  const allSelected = notice.tasks.length > 0 && notice.tasks.every((t) => t.selected);
  const handleToggleAll = () => {
    const updatedTasks = notice.tasks.map((t) => ({ ...t, selected: !allSelected }));
    onUpdateNotice({ ...notice, tasks: updatedTasks });
  };

  // Start editing a task
  const handleStartEdit = (task: SchoolNoticeItem) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
    setEditedDueDate(task.due_date || '');
    setEditedNotes(task.notes || '');
    setEditedPriority(task.priority);
    setEditedCategory(task.category);
  };

  // Save edited task
  const handleSaveEdit = (taskId: string) => {
    if (!editedTitle.trim()) return;
    const updatedTasks = notice.tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            title: editedTitle.trim(),
            due_date: editedDueDate.trim() || null,
            notes: editedNotes.trim(),
            priority: editedPriority,
            category: editedCategory,
          }
        : t
    );
    onUpdateNotice({ ...notice, tasks: updatedTasks });
    setEditingTaskId(null);
  };

  // Delete a task
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = notice.tasks.filter((t) => t.id !== taskId);
    onUpdateNotice({ ...notice, tasks: updatedTasks });
  };

  // Add a brand new task
  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: SchoolNoticeItem = {
      id: `custom-task-${Date.now()}`,
      title: newTitle.trim(),
      due_date: newDueDate.trim() || null,
      category: newCategory,
      priority: newPriority,
      notes: 'Added manually by parent',
      selected: true,
      synced: false,
    };

    onUpdateNotice({
      ...notice,
      tasks: [...notice.tasks, newTask],
    });

    setNewTitle('');
    setShowNewTaskForm(false);
  };

  // Convert items to bring into a packing task
  const handleAddItemsAsTask = () => {
    if (!notice.items_to_bring.length) return;
    const itemsText = notice.items_to_bring.join(', ');
    const newTask: SchoolNoticeItem = {
      id: `kit-task-${Date.now()}`,
      title: `Pack kit & items for ${notice.title}`,
      due_date: notice.due_date || null,
      category: 'preparation',
      priority: 'high',
      notes: `Items needed: ${itemsText}`,
      selected: true,
      synced: false,
    };
    onUpdateNotice({
      ...notice,
      tasks: [...notice.tasks, newTask],
    });
  };

  const selectedCount = notice.tasks.filter((t) => t.selected).length;

  const categoryColor = (cat: TaskCategory) => {
    switch (cat) {
      case 'payment':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'paperwork':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparation':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'event':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'attendance':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('review.back_button')}</span>
        </button>
        <div className="flex items-center gap-1.5">
          {notice.ocr_result && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Scan className="w-3 h-3 text-emerald-600" />
              <span>OCR Read First ({notice.ocr_result.confidence}% confidence)</span>
            </span>
          )}
          <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Sparkles className="w-3 h-3" />
            <span>AI Extracted</span>
          </span>
        </div>
      </div>

      {/* Protective Confirmation Banner */}
      <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 shadow-xs flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-black text-sm shadow-xs">
          ？
        </div>
        <div className="flex-1 text-xs text-amber-950">
          <span className="font-extrabold text-amber-950 text-sm block">
            {t('review.title')}
          </span>
          <p className="text-amber-900/90 text-xs mt-1 leading-relaxed">
            {t('review.subtitle')}
          </p>
        </div>
      </div>

      {/* On-device Privacy Redaction Completed Banner ("借走個名" 成功還原) */}
      {notice.redaction_report && notice.redaction_report.tokens.length > 0 && (
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">本地隱私保護已完成（已在手機本地還原真實姓名）</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  零洩漏
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                AI 伺服器僅接觸到匿名代號 <code className="text-blue-300 font-mono">[CHILD_1]</code>、<code className="text-blue-300 font-mono">[SCHOOL]</code>，小朋友與學校個資完全沒有離開過這部手機。
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowShieldModal(true)}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline flex items-center gap-1 shrink-0 cursor-pointer self-end sm:self-center"
          >
            <Lock className="w-3 h-3" />
            <span>查看脫敏還原明細</span>
          </button>
        </div>
      )}

      {/* Main Notice Overview Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <School className="w-4 h-4 text-blue-600" />
              <span>{notice.school_name || 'School'}</span>
            </div>
            {notice.child_name && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <User className="w-3 h-3 text-emerald-600" />
                <span>小朋友：{notice.child_name}</span>
              </span>
            )}
          </div>
          {notice.due_date && (
            <div className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5" />
              <span>Main Deadline: {notice.due_date}</span>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">{notice.title}</h2>
          {notice.summary && <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{notice.summary}</p>}
        </div>

        {/* Payment callout if required */}
        {notice.payment?.required && (
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">Payment Required: {notice.payment.amount}</span>
                {notice.payment.method && (
                  <span className="font-semibold text-[10px] px-1.5 py-0.5 rounded bg-amber-200/60 text-amber-900">
                    via {notice.payment.method}
                  </span>
                )}
              </div>
              <p className="text-amber-800 mt-0.5">
                {notice.payment.notes || 'Please settle on your school payment platform.'}
              </p>
              {notice.payment.due_date && (
                <p className="text-[11px] font-semibold text-amber-900 mt-1">Due by: {notice.payment.due_date}</p>
              )}
            </div>
          </div>
        )}

        {/* Items to bring */}
        {notice.items_to_bring?.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Package className="w-3.5 h-3.5 text-blue-600" />
                <span>Items Child Must Bring:</span>
              </div>
              <button
                type="button"
                onClick={handleAddItemsAsTask}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
              >
                + Add as packing task
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {notice.items_to_bring.map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-lg font-medium shadow-2xs"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Important alerts like allergy notices */}
        {notice.important_notes?.length > 0 && (
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Important School Notes:</span>
            </div>
            <ul className="text-xs text-rose-800 space-y-0.5 list-disc list-inside">
              {notice.important_notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Original notice / OCR collapsible */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowOriginalNotice(!showOriginalNotice)}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
          >
            {notice.ocr_result ? (
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <Scan className="w-3 h-3 text-emerald-600" />
                <span>
                  {showOriginalNotice
                    ? 'Hide Verbatim OCR Transcribed Text'
                    : `View Verbatim OCR Transcribed Text (${notice.ocr_result.word_count} words)`}
                </span>
              </span>
            ) : (
              <span>{showOriginalNotice ? 'Hide Original Notice Text' : 'View Original Notice Text'}</span>
            )}
            {showOriginalNotice ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {showOriginalNotice && (
            <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto font-mono leading-relaxed">
              {notice.raw_text}
            </div>
          )}
        </div>
      </div>

      {/* Task Checklist Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">{t('review.tasks_to_add')}</h3>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              {selectedCount} / {notice.tasks.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleAll}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              {allSelected ? t('review.deselect_all') : t('review.select_all')}
            </button>
            <button
              type="button"
              onClick={() => setShowNewTaskForm(!showNewTaskForm)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>{t('review.add_task')}</span>
            </button>
          </div>
        </div>

        {/* Add new task inline form */}
        {showNewTaskForm && (
          <form
            onSubmit={handleAddNewTask}
            className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2.5"
          >
            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
              <span>Add Custom School Task</span>
              <button
                type="button"
                onClick={() => setShowNewTaskForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Return signed consent slip to teacher"
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Due Date:</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 focus:outline-hidden"
                >
                  <option value="paperwork">Paperwork / Consent</option>
                  <option value="payment">Payment</option>
                  <option value="preparation">Kit / Preparation</option>
                  <option value="event">Event / Attendance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Priority:</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 focus:outline-hidden"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowNewTaskForm(false)}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs"
              >
                Add Task
              </button>
            </div>
          </form>
        )}

        {/* Task list items */}
        <div className="space-y-2">
          {notice.tasks.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No tasks found. Click "Add Task" to create one manually.
            </div>
          ) : (
            notice.tasks.map((task) => {
              const isEditing = editingTaskId === task.id;

              if (isEditing) {
                return (
                  <div key={task.id} className="p-3 bg-slate-50 border border-blue-300 rounded-xl space-y-2">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 block">Due Date:</label>
                        <input
                          type="date"
                          value={editedDueDate}
                          onChange={(e) => setEditedDueDate(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">Category:</label>
                        <select
                          value={editedCategory}
                          onChange={(e) => setEditedCategory(e.target.value as TaskCategory)}
                          className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5"
                        >
                          <option value="paperwork">Paperwork / Consent</option>
                          <option value="payment">Payment</option>
                          <option value="preparation">Kit / Preparation</option>
                          <option value="event">Event</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">Priority:</label>
                        <select
                          value={editedPriority}
                          onChange={(e) => setEditedPriority(e.target.value as TaskPriority)}
                          className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5"
                        >
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Notes / Details:</label>
                      <input
                        type="text"
                        value={editedNotes}
                        onChange={(e) => setEditedNotes(e.target.value)}
                        placeholder="Additional details, ParentPay instructions, etc."
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingTaskId(null)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(task.id)}
                        className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    task.selected
                      ? 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                      : 'border-slate-200/60 bg-slate-50/60 opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.selected}
                    onChange={() => handleToggleTask(task.id)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${categoryColor(
                          task.category
                        )}`}
                      >
                        {task.category}
                      </span>
                      {task.priority === 'high' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 uppercase">
                          High Priority
                        </span>
                      )}
                      {task.due_date && (
                        <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>Due: {task.due_date}</span>
                        </span>
                      )}
                      {task.synced && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Synced</span>
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-xs sm:text-sm font-bold text-slate-900 leading-snug flex flex-wrap items-center gap-1.5 ${
                        !task.selected ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {(task.child_name || notice.child_name) && (
                        <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-200">
                          {task.child_name || notice.child_name}
                        </span>
                      )}
                      <span>{task.title}</span>
                    </h4>

                    {task.notes && (
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{task.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(task)}
                      title="Edit task"
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete task"
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Fixed bottom action card for syncing */}
      <div className="sticky bottom-3 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-lg ring-1 ring-black/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-bold text-slate-900 block sm:inline">
              {t('sync_modal.target_list')}{' '}
              <span className="text-blue-600 font-extrabold">{selectedListTitle || 'School Inbox 🎒'}</span>
            </span>
            <span className="text-slate-500 sm:ml-2 block sm:inline">
              {selectedCount} {t('review.tasks_to_add')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={onGoogleSignIn}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span>{t('auth.sign_in_google')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onInitiateSync}
                disabled={selectedCount === 0}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>{t('review.sync_button', { count: selectedCount })}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Redaction Shield Modal for Inspecting Privacy Tokens */}
      <RedactionShieldModal
        isOpen={showShieldModal}
        onClose={() => setShowShieldModal(false)}
        report={notice.redaction_report || undefined}
        childName={notice.child_name || ''}
      />
    </div>
  );
};
