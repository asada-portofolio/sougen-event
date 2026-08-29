import { useState, useEffect, useMemo, useRef } from 'react';
import { api } from '../../../services/api';
import { 
  Loader2, 
  Plus, 
  Trash2, 
  CalendarDays, 
  Clock, 
  X, 
  MapPin, 
  Check, 
  Save, 
  Calendar,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '../../../lib/utils';

interface TabRundownProps {
  eventData: any;
  onUpdate: (data: any) => void;
}

/**
 * Parse date safely in UTC to avoid local timezone shifts
 */
function parseUTCDate(dateStrOrObj: string | Date): Date {
  if (typeof dateStrOrObj === 'string') {
    const clean = dateStrOrObj.split('T')[0];
    const [y, m, d] = clean.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }
  return new Date(dateStrOrObj);
}

/**
 * Format Date to dd/mm/yy e.g. "01/10/26"
 */
function formatDDMMYY(dateStrOrObj: string | Date): string {
  if (!dateStrOrObj) return '';
  const d = parseUTCDate(dateStrOrObj);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = String(d.getUTCFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

/**
 * Format Date with Day Name and dd/mm/yy e.g. "Sabtu, 01/10/26"
 */
function formatDayDDMMYY(dateStrOrObj: string | Date): string {
  if (!dateStrOrObj) return '';
  const d = parseUTCDate(dateStrOrObj);
  if (isNaN(d.getTime())) return '';
  const weekday = d.toLocaleDateString('id-ID', { weekday: 'long', timeZone: 'UTC' });
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = String(d.getUTCFullYear()).slice(-2);
  return `${weekday}, ${day}/${month}/${year}`;
}

/**
 * Format short weekday + dd/mm/yy e.g. "Sab, 01/10/26"
 */
function formatShortDayDDMMYY(dateStrOrObj: string | Date): string {
  if (!dateStrOrObj) return '';
  const d = parseUTCDate(dateStrOrObj);
  if (isNaN(d.getTime())) return '';
  const weekday = d.toLocaleDateString('id-ID', { weekday: 'short', timeZone: 'UTC' });
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = String(d.getUTCFullYear()).slice(-2);
  return `${weekday}, ${day}/${month}/${year}`;
}

/**
 * Add minutes to 24h time string HH:mm (e.g. "09:00" + 45 -> "09:45")
 */
function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  if (!timeStr || !timeStr.includes(':')) return '10:00';
  const parts = timeStr.split(':');
  let h = parseInt(parts[0], 10);
  let m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return '10:00';

  let totalMinutes = h * 60 + m + minutesToAdd;
  totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;

  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;

  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

/**
 * Auto-format typed time value e.g. "0930" -> "09:30"
 */
function sanitizeTimeInput(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
}

/**
 * Normalize time to valid 24h HH:mm format
 */
function normalizeTime24(timeStr: string): string {
  if (!timeStr) return '';
  const clean = timeStr.trim();
  if (/^\d{1,2}:\d{2}$/.test(clean)) {
    const [h, m] = clean.split(':').map(Number);
    const validH = Math.min(23, Math.max(0, h));
    const validM = Math.min(59, Math.max(0, m));
    return `${String(validH).padStart(2, '0')}:${String(validM).padStart(2, '0')}`;
  }
  return clean;
}

/**
 * Format time in 24-hour format HH:mm (removes AM/PM)
 */
function format24HourTime(timeStr: string): string {
  if (!timeStr) return '';
  return timeStr.replace(/\s*(am|pm)/gi, '').trim();
}

/**
 * Generate all date strings (YYYY-MM-DD) between start and end date inclusive in UTC.
 */
function getDateRangeArray(startStr: string, endStr: string): string[] {
  if (!startStr || !endStr) return [];
  const cleanStart = startStr.split('T')[0];
  const cleanEnd = endStr.split('T')[0];
  const [sy, sm, sd] = cleanStart.split('-').map(Number);
  const [ey, em, ed] = cleanEnd.split('-').map(Number);

  const start = new Date(Date.UTC(sy, sm - 1, sd));
  const end = new Date(Date.UTC(ey, em - 1, ed));
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return [];

  const dates: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

export default function TabRundown({ eventData, onUpdate }: TabRundownProps) {
  const [loading, setLoading] = useState(false);
  const [savingDates, setSavingDates] = useState(false);
  const [dateSavedMessage, setDateSavedMessage] = useState(false);

  // Date Range States
  const [startDate, setStartDate] = useState(
    eventData?.startDate ? eventData.startDate.split('T')[0] : ''
  );
  const [endDate, setEndDate] = useState(
    eventData?.endDate ? eventData.endDate.split('T')[0] : ''
  );

  const [selectedDates, setSelectedDates] = useState<string[]>(
    eventData?.eventDays?.map((d: any) => d.date.split('T')[0]) || []
  );

  // Sync state when eventData changes externally
  useEffect(() => {
    if (eventData) {
      const s = eventData.startDate ? eventData.startDate.split('T')[0] : '';
      const e = eventData.endDate ? eventData.endDate.split('T')[0] : '';
      setStartDate(s);
      setEndDate(e);

      const daysInEvent = eventData.eventDays?.map((d: any) => d.date.split('T')[0]) || [];
      if (daysInEvent.length > 0) {
        setSelectedDates(daysInEvent);
      } else if (s && e) {
        setSelectedDates(getDateRangeArray(s, e));
      }
    }
  }, [eventData]);

  // All dates within the selected range
  const allRangeDates = useMemo(() => {
    return getDateRangeArray(startDate, endDate);
  }, [startDate, endDate]);

  // Is dirty checker to enable save button
  const originalStartDate = eventData?.startDate ? eventData.startDate.split('T')[0] : '';
  const originalEndDate = eventData?.endDate ? eventData.endDate.split('T')[0] : '';
  const originalSelectedDates = useMemo(() => {
    return (eventData?.eventDays?.map((d: any) => d.date.split('T')[0]) || []).sort();
  }, [eventData]);

  const currentSelectedSorted = useMemo(() => {
    return [...selectedDates].sort();
  }, [selectedDates]);

  const isDateRangeDirty = 
    startDate !== originalStartDate ||
    endDate !== originalEndDate ||
    JSON.stringify(currentSelectedSorted) !== JSON.stringify(originalSelectedDates);

  // Rundown Modal States
  const [rundownModalOpen, setRundownModalOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const [activeTimeField, setActiveTimeField] = useState<'start' | 'end'>('start');
  const [newRundown, setNewRundown] = useState({
    timeStart: '',
    timeEnd: '',
    activityType: 'manual',
    activityName: '',
  });

  const startTimeInputRef = useRef<HTMLInputElement>(null);
  const endTimeInputRef = useRef<HTMLInputElement>(null);
  const startTimePickerRef = useRef<HTMLInputElement>(null);
  const endTimePickerRef = useRef<HTMLInputElement>(null);
  const activityNameInputRef = useRef<HTMLInputElement>(null);

  const eventDays = eventData.eventDays || [];

  // Handlers for Date & Day Selection
  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    let newEnd = endDate;
    if (newEnd && newStart > newEnd) {
      newEnd = newStart;
      setEndDate(newStart);
    }
    // Update selected dates within new range
    const newRange = getDateRangeArray(newStart, newEnd);
    setSelectedDates(prev => {
      const filtered = prev.filter(d => newRange.includes(d));
      return filtered.length > 0 ? filtered : newRange;
    });
  };

  const handleEndDateChange = (newEnd: string) => {
    setEndDate(newEnd);
    let newStart = startDate;
    if (newStart && newEnd < newStart) {
      newStart = newEnd;
      setStartDate(newEnd);
    }
    // Update selected dates within new range
    const newRange = getDateRangeArray(newStart, newEnd);
    setSelectedDates(prev => {
      const filtered = prev.filter(d => newRange.includes(d));
      return filtered.length > 0 ? filtered : newRange;
    });
  };

  const toggleDateSelection = (dateStr: string) => {
    setSelectedDates(prev => {
      if (prev.includes(dateStr)) {
        if (prev.length === 1) {
          alert('Event harus memiliki minimal 1 hari pelaksanaan aktif.');
          return prev;
        }
        return prev.filter(d => d !== dateStr);
      } else {
        return [...prev, dateStr].sort();
      }
    });
  };

  const handleSelectAllDates = () => {
    setSelectedDates(allRangeDates);
  };

  const handleSaveDateSchedule = async () => {
    if (!startDate || !endDate) {
      alert('Tanggal mulai dan selesai wajib diisi.');
      return;
    }
    if (selectedDates.length === 0) {
      alert('Pilih minimal 1 hari pelaksanaan event.');
      return;
    }

    const willLoseRundowns = eventData.eventDays?.some(
      (d: any) => !selectedDates.includes(d.date.split('T')[0]) && d.rundownItems?.length > 0
    );

    const confirmMsg = willLoseRundowns
      ? '⚠️ Peringatan: Terdapat hari dengan item rundown yang tidak dipilih dan akan dihapus. Lanjutkan menyimpan perubahan tanggal dan jadwal hari?'
      : 'Simpan perubahan tanggal dan jadwal hari pelaksanaan event?';

    if (!window.confirm(confirmMsg)) {
      return;
    }

    setSavingDates(true);
    setDateSavedMessage(false);
    try {
      const res = await api.put(`/api/events/${eventData.id}`, {
        startDate,
        endDate,
        selectedDates,
      });

      // Instantly update parent state with the full event response
      onUpdate(res.data);

      const newS = res.data.startDate ? res.data.startDate.split('T')[0] : startDate;
      const newE = res.data.endDate ? res.data.endDate.split('T')[0] : endDate;
      setStartDate(newS);
      setEndDate(newE);
      const newDays = res.data.eventDays?.map((d: any) => d.date.split('T')[0]) || selectedDates;
      setSelectedDates(newDays);

      setDateSavedMessage(true);
      setTimeout(() => setDateSavedMessage(false), 3000);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menyimpan pengaturan tanggal.');
    } finally {
      setSavingDates(false);
    }
  };

  // Handlers for Rundown Items
  const openRundownModal = (dayId: number) => {
    setSelectedDayId(dayId);
    setActiveTimeField('start');
    const targetDay = eventData.eventDays?.find((d: any) => d.id === dayId);
    let defaultStart = '19:00';
    let defaultEnd = '20:00';

    if (targetDay && targetDay.rundownItems?.length > 0) {
      const items = [...targetDay.rundownItems];
      const lastItem = items[items.length - 1];
      if (lastItem && lastItem.time) {
        const parts = lastItem.time.split('-').map((s: string) => s.trim());
        if (parts.length >= 2 && parts[1].includes(':')) {
          defaultStart = normalizeTime24(parts[1]);
          defaultEnd = addMinutesToTime(defaultStart, 60);
        } else if (parts.length >= 1 && parts[0].includes(':')) {
          defaultStart = addMinutesToTime(normalizeTime24(parts[0]), 60);
          defaultEnd = addMinutesToTime(defaultStart, 60);
        }
      }
    }

    setNewRundown({
      timeStart: defaultStart,
      timeEnd: defaultEnd,
      activityType: 'manual',
      activityName: '',
    });
    setRundownModalOpen(true);
  };

  const handleSubmitRundown = async () => {
    if (!selectedDayId) return;
    const cleanStart = normalizeTime24(newRundown.timeStart);
    const cleanEnd = normalizeTime24(newRundown.timeEnd);

    if (!cleanStart || !cleanEnd) {
      alert('Waktu mulai dan selesai wajib diisi dengan format yang valid (HH:MM).');
      return;
    }
    if (!newRundown.activityName) {
      alert('Nama aktivitas / pengisi acara wajib diisi.');
      return;
    }

    const time = `${cleanStart} - ${cleanEnd}`;
    setLoading(true);
    try {
      await api.post(`/api/event-days/${selectedDayId}/rundown`, { 
        time, 
        activityName: newRundown.activityName,
      });
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
      setRundownModalOpen(false);
    } catch {
      alert('Gagal menambah rundown.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRundown = async (rundownId: number) => {
    if (!confirm('Hapus rundown ini?')) return;
    try {
      await api.delete(`/api/rundown/${rundownId}`);
      const res = await api.get(`/api/events/${eventData.slug}`);
      onUpdate(res.data);
    } catch {
      alert('Gagal menghapus rundown.');
    }
  };

  const selectedDay = eventData.eventDays?.find((d: any) => d.id === selectedDayId);
  const timePresets = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];

  const handleApplyPreset = (preset: string) => {
    if (activeTimeField === 'start') {
      setNewRundown(prev => ({ ...prev, timeStart: preset }));
    } else {
      setNewRundown(prev => ({ ...prev, timeEnd: preset }));
    }
  };

  return (
    <div id="field-rundown" className="space-y-6 p-1 sm:p-2 rounded-2xl transition-all">
      {/* ── SECTION 1: Integrated Date Range & Active Days Manager ── */}
      <div className="border border-admin-border rounded-2xl bg-white p-4 sm:p-5 shadow-xs space-y-4">
        {/* Header with Save Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-admin-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sougen-blue/10 text-sougen-blue shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-poppins font-bold text-admin-dark leading-tight">
                Pengaturan Tanggal & Hari Pelaksanaan
              </h3>
              <p className="text-xs text-admin-secondary mt-0.5">
                Rentang: {startDate ? formatDDMMYY(startDate) : '-'} s/d {endDate ? formatDDMMYY(endDate) : '-'} • Tentukan hari mana saja event akan diselenggarakan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveDateSchedule}
            disabled={savingDates || !isDateRangeDirty}
            className={cn(
              "hidden sm:inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 active:scale-95",
              dateSavedMessage
                ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                : isDateRangeDirty
                  ? "bg-sougen-blue hover:bg-[#0082c4] text-white shadow-sm"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            )}
            title="Simpan pengaturan tanggal & sinkronkan hari"
          >
            {savingDates ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : dateSavedMessage ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Jadwal Hari</span>
              </>
            )}
          </button>
        </div>

        {/* Inputs: Tanggal Mulai & Selesai */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 items-end">
          <div>
            <label className="block text-xs font-semibold text-admin-dark mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sougen-blue" />
              <span>Tanggal Mulai Event</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-admin-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-admin-dark mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sougen-blue" />
              <span>Tanggal Selesai Event</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-admin-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue transition-all"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center justify-between sm:col-span-2 lg:col-span-1">
            <span className="text-xs text-admin-secondary font-medium">Rentang Keseluruhan:</span>
            <span className="text-xs font-bold text-sougen-blue bg-sougen-blue/10 px-2.5 py-1 rounded-lg border border-sougen-blue/20">
              {allRangeDates.length} Hari ({selectedDates.length} Hari Aktif)
            </span>
          </div>
        </div>

        {/* ── Custom Active Days Selector ── */}
        {allRangeDates.length > 0 && (
          <div className="pt-3 border-t border-gray-100 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-admin-dark flex items-center gap-1.5">
                  <span>Pilih Hari Pelaksanaan Event</span>
                  <span className="text-[11px] font-normal text-admin-secondary">
                    (Pilih tanggal di mana acara berlangsung)
                  </span>
                </h4>
              </div>

              {allRangeDates.length > 1 && (
                <button
                  type="button"
                  onClick={handleSelectAllDates}
                  className="text-[11px] font-bold text-sougen-blue hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Pilih Semua Hari</span>
                </button>
              )}
            </div>

            {/* Day Chips / Cards Grid (3 Columns on Mobile!) */}
            <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
              {allRangeDates.map((dateStr, idx) => {
                const isSelected = selectedDates.includes(dateStr);
                const activeIndex = selectedDates.indexOf(dateStr);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => toggleDateSelection(dateStr)}
                    className={cn(
                      "flex flex-col justify-between p-2 sm:p-3 rounded-xl border text-left transition-all active:scale-95 group min-h-[66px] sm:min-h-[72px]",
                      isSelected
                        ? "bg-sougen-blue/5 border-sougen-blue/40 shadow-xs hover:border-sougen-blue ring-1 ring-sougen-blue/10"
                        : "bg-gray-50/70 border-gray-200 text-gray-400 hover:bg-gray-100/70"
                    )}
                  >
                    <div className="flex items-center justify-between w-full gap-1 mb-1">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-poppins font-bold shrink-0",
                        isSelected 
                          ? "bg-sougen-blue text-white" 
                          : "bg-gray-200 text-gray-500"
                      )}>
                        {isSelected ? `H${activeIndex + 1}` : `H${idx + 1}`}
                      </span>

                      <div className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5 rounded-md flex items-center justify-center border transition-all shrink-0",
                        isSelected 
                          ? "bg-sougen-blue border-sougen-blue text-white" 
                          : "border-gray-300 bg-white text-transparent group-hover:border-gray-400"
                      )}>
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                      </div>
                    </div>

                    <div className="min-w-0 w-full">
                      <p className={cn(
                        "text-[10px] sm:text-xs font-bold leading-tight truncate",
                        isSelected ? "text-admin-dark" : "text-gray-400 line-through"
                      )}>
                        {formatShortDayDDMMYY(dateStr)}
                      </p>
                      {!isSelected && (
                        <span className="text-[8px] sm:text-[9px] text-gray-400 italic block mt-0.5 leading-none truncate">
                          Libur
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {isDateRangeDirty && (
              <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Terdapat perubahan hari pelaksanaan yang belum disimpan. Klik <strong>"Simpan Jadwal Hari"</strong> untuk memperbarui daftar rundown.</span>
              </p>
            )}

            {/* Mobile Save Button (Placed below warning) */}
            <div className="pt-1.5 sm:hidden">
              <button
                type="button"
                onClick={handleSaveDateSchedule}
                disabled={savingDates || !isDateRangeDirty}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95",
                  dateSavedMessage
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                    : isDateRangeDirty
                      ? "bg-sougen-blue hover:bg-[#0082c4] text-white shadow-sm"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                )}
              >
                {savingDates ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : dateSavedMessage ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Jadwal Hari Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Jadwal Hari</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 2: Event Days & Rundown Items ── */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-poppins font-bold text-admin-dark flex items-center gap-2">
              <span>Jadwal Rundown Pelaksanaan ({eventDays.length} Hari)</span>
            </h3>
            <p className="text-xs text-admin-secondary mt-0.5">
              Isi susunan acara kegiatan untuk tiap hari pelaksanaan event.
            </p>
          </div>
        </div>

        {eventDays.length > 0 ? (
          <div className="space-y-5">
            {eventDays.map((day: any) => (
              <div key={day.id} className="border border-admin-border rounded-2xl bg-gray-50 overflow-hidden shadow-xs">
                {/* Day Header */}
                <div className="flex items-center justify-between bg-white border-b border-admin-border p-3.5 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sougen-blue/10 flex items-center justify-center text-sougen-blue font-bold font-poppins text-sm shrink-0 border border-sougen-blue/20">
                      H{day.dayNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-admin-dark text-sm sm:text-base font-poppins">
                        {formatDayDDMMYY(day.date)}
                      </h4>
                      {day.locationOverride && (
                        <p className="text-xs text-admin-secondary mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{day.locationOverride}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openRundownModal(day.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-sougen-blue/10 hover:bg-sougen-blue/20 text-sougen-blue rounded-lg font-bold text-xs transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Item Rundown</span>
                    </button>
                  </div>
                </div>

                {/* Rundown Items */}
                <div className="p-3.5 sm:p-4 space-y-2.5">
                  {day.rundownItems?.length > 0 ? (
                    day.rundownItems.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-admin-border/80 rounded-xl shadow-2xs group hover:border-sougen-blue/40 transition-all">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="flex items-center gap-1.5 text-admin-dark font-mono font-bold text-xs bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 shrink-0">
                            <Clock className="w-3.5 h-3.5 text-sougen-blue" />
                            <span>{format24HourTime(item.time)}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-admin-dark truncate">{item.activityName}</p>
                            {item.location && <p className="text-[10px] text-admin-secondary mt-0.5">{item.location}</p>}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteRundown(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          title="Hapus item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-admin-secondary text-center py-4 bg-white border border-dashed border-gray-200 rounded-xl">
                      Belum ada jadwal rundown untuk hari ini. Klik <strong>"+ Item Rundown"</strong> di atas.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center bg-gray-50/70">
            <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-poppins font-bold text-admin-dark text-base mb-1">Belum Ada Hari Pelaksanaan Aktif</h3>
            <p className="text-xs text-admin-secondary max-w-sm mx-auto mb-4">
              Pilih tanggal pelaksanaan event pada kontrol tanggal di atas, lalu klik tombol "Simpan Jadwal Hari".
            </p>
          </div>
        )}
      </div>

      {/* ── MODAL: Tambah Item Rundown ── */}
      <Dialog.Root open={rundownModalOpen} onOpenChange={setRundownModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-all" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-admin-border mb-4">
              <div>
                <Dialog.Title className="font-poppins font-bold text-base text-admin-dark flex items-center gap-2">
                  <span>Tambah Item Rundown</span>
                  {selectedDay && (
                    <span className="px-2 py-0.5 rounded-md bg-sougen-blue/10 text-sougen-blue text-xs font-semibold">
                      H{selectedDay.dayNumber}
                    </span>
                  )}
                </Dialog.Title>
                <Dialog.Description className="text-xs text-admin-secondary mt-0.5">
                  {selectedDay ? formatDayDDMMYY(selectedDay.date) : 'Masukkan waktu dan nama kegiatan.'}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-admin-dark transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              {/* ── SECTION WAKTU: Fast Input & Presets ── */}
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-admin-dark flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sougen-blue" />
                    <span>Waktu Pelaksanaan (Format 24 Jam)</span>
                  </label>
                </div>

                {/* Dual Inputs with Single Left Clock Icon Trigger */}
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setActiveTimeField('start')}
                    className={cn(
                      "p-2.5 rounded-xl border transition-all cursor-pointer",
                      activeTimeField === 'start'
                        ? "bg-sougen-blue/5 border-sougen-blue/60 ring-2 ring-sougen-blue/20"
                        : "bg-white border-admin-border hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-admin-dark cursor-pointer">
                        Waktu Mulai
                      </label>
                      {activeTimeField === 'start' && (
                        <span className="text-[9px] font-bold text-sougen-blue bg-sougen-blue/10 px-1.5 py-0.5 rounded">
                          Aktif
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTimeField('start');
                          if (startTimePickerRef.current) {
                            if (typeof (startTimePickerRef.current as any).showPicker === 'function') {
                              try {
                                (startTimePickerRef.current as any).showPicker();
                              } catch {
                                startTimePickerRef.current.focus();
                              }
                            } else {
                              startTimePickerRef.current.focus();
                            }
                          }
                        }}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center p-0.5 text-sougen-blue hover:text-sougen-blue/80 transition-colors"
                        title="Buka Pilihan Jam Mulai (24 Jam)"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>
                      <input 
                        ref={startTimeInputRef}
                        type="text" 
                        placeholder="19:00"
                        maxLength={5}
                        enterKeyHint="next"
                        value={newRundown.timeStart}
                        onFocus={() => setActiveTimeField('start')}
                        onChange={e => {
                          const val = sanitizeTimeInput(e.target.value);
                          setNewRundown(prev => ({ ...prev, timeStart: val }));
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            endTimeInputRef.current?.focus();
                            setActiveTimeField('end');
                          }
                        }}
                        onBlur={e => {
                          const normalized = normalizeTime24(e.target.value);
                          if (normalized) {
                            setNewRundown(prev => ({ ...prev, timeStart: normalized }));
                          }
                        }}
                        className="w-full pl-8 pr-3 py-1.5 border border-admin-border/80 rounded-lg text-xs font-mono font-bold bg-white focus:outline-none focus:ring-1 focus:ring-sougen-blue focus:border-sougen-blue"
                      />
                      <input
                        ref={startTimePickerRef}
                        type="time"
                        step="60"
                        value={newRundown.timeStart}
                        onChange={e => setNewRundown(prev => ({ ...prev, timeStart: e.target.value }))}
                        className="sr-only pointer-events-none"
                        tabIndex={-1}
                      />
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTimeField('end')}
                    className={cn(
                      "p-2.5 rounded-xl border transition-all cursor-pointer",
                      activeTimeField === 'end'
                        ? "bg-sougen-blue/5 border-sougen-blue/60 ring-2 ring-sougen-blue/20"
                        : "bg-white border-admin-border hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-admin-dark cursor-pointer">
                        Waktu Selesai
                      </label>
                      {activeTimeField === 'end' && (
                        <span className="text-[9px] font-bold text-sougen-blue bg-sougen-blue/10 px-1.5 py-0.5 rounded">
                          Aktif
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTimeField('end');
                          if (endTimePickerRef.current) {
                            if (typeof (endTimePickerRef.current as any).showPicker === 'function') {
                              try {
                                (endTimePickerRef.current as any).showPicker();
                              } catch {
                                endTimePickerRef.current.focus();
                              }
                            } else {
                              endTimePickerRef.current.focus();
                            }
                          }
                        }}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center p-0.5 text-sougen-blue hover:text-sougen-blue/80 transition-colors"
                        title="Buka Pilihan Jam Selesai (24 Jam)"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>
                      <input 
                        ref={endTimeInputRef}
                        type="text" 
                        placeholder="20:00"
                        maxLength={5}
                        enterKeyHint="next"
                        value={newRundown.timeEnd}
                        onFocus={() => setActiveTimeField('end')}
                        onChange={e => {
                          const val = sanitizeTimeInput(e.target.value);
                          setNewRundown(prev => ({ ...prev, timeEnd: val }));
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            activityNameInputRef.current?.focus();
                          }
                        }}
                        onBlur={e => {
                          const normalized = normalizeTime24(e.target.value);
                          if (normalized) {
                            setNewRundown(prev => ({ ...prev, timeEnd: normalized }));
                          }
                        }}
                        className="w-full pl-8 pr-3 py-1.5 border border-admin-border/80 rounded-lg text-xs font-mono font-bold bg-white focus:outline-none focus:ring-1 focus:ring-sougen-blue focus:border-sougen-blue"
                      />
                      <input
                        ref={endTimePickerRef}
                        type="time"
                        step="60"
                        value={newRundown.timeEnd}
                        onChange={e => setNewRundown(prev => ({ ...prev, timeEnd: e.target.value }))}
                        className="sr-only pointer-events-none"
                        tabIndex={-1}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Time Preset Chips (19:00 - 22:00) */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-gray-600 font-medium">
                      Pintasan Jam:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {timePresets.map(preset => {
                      const currentTargetValue = activeTimeField === 'start' ? newRundown.timeStart : newRundown.timeEnd;
                      const isSelected = currentTargetValue === preset;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border active:scale-95",
                            isSelected
                              ? "bg-sougen-blue text-white border-sougen-blue shadow-xs"
                              : "bg-white text-admin-dark border-gray-200 hover:border-sougen-blue/50 hover:bg-sougen-blue/5"
                          )}
                        >
                          {preset}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── SECTION DETAIL KEGIATAN ── */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-admin-dark">Jenis Aktivitas</label>
                <select 
                  value={newRundown.activityType}
                  onChange={e => setNewRundown({...newRundown, activityType: e.target.value, activityName: ''})}
                  className="w-full px-3 py-2 border border-admin-border rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                >
                  <option value="manual">Ketik Manual Bebas</option>
                  {eventData.eventPrograms?.length > 0 && <option value="program">Program Event Terpilih</option>}
                  {eventData.eventTalents?.length > 0 && <option value="talent">Talent / Pengisi Acara</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-admin-dark">Nama Aktivitas / Acara</label>
                {newRundown.activityType === 'manual' && (
                  <input 
                    ref={activityNameInputRef}
                    type="text" 
                    placeholder="Contoh: Registrasi Ulang, Pembukaan Acara, Q&A..."
                    value={newRundown.activityName}
                    onChange={e => setNewRundown({...newRundown, activityName: e.target.value})}
                    className="w-full px-3 py-2 border border-admin-border rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                  />
                )}
                {newRundown.activityType === 'program' && (
                  <select 
                    value={newRundown.activityName}
                    onChange={e => setNewRundown({...newRundown, activityName: e.target.value})}
                    className="w-full px-3 py-2 border border-admin-border rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                  >
                    <option value="" disabled>-- Pilih Program --</option>
                    {eventData.eventPrograms.map((ep: any) => (
                      <option key={ep.id} value={ep.program.name}>{ep.program.name}</option>
                    ))}
                  </select>
                )}
                {newRundown.activityType === 'talent' && (
                  <select 
                    value={newRundown.activityName}
                    onChange={e => setNewRundown({...newRundown, activityName: e.target.value})}
                    className="w-full px-3 py-2 border border-admin-border rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sougen-blue/20 focus:border-sougen-blue"
                  >
                    <option value="" disabled>-- Pilih Talent --</option>
                    {eventData.eventTalents.map((et: any) => (
                      <option key={et.id} value={`Penampilan: ${et.talent.stageName}`}>
                        {et.talent.stageName} {et.roleOverride || et.role ? `(${et.roleOverride || et.role})` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-admin-border">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 text-xs font-bold text-admin-secondary hover:bg-gray-100 rounded-xl transition-colors">
                    Batal
                  </button>
                </Dialog.Close>
                <button 
                  onClick={handleSubmitRundown}
                  disabled={loading}
                  className="px-5 py-2 bg-sougen-blue text-white text-xs font-bold rounded-xl hover:bg-[#0082c4] shadow-sm transition-all disabled:opacity-50 active:scale-95 flex items-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Simpan Rundown</span>
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
