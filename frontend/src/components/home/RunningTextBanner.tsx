import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import type { ActiveEvent } from '../../types/event';
import { api } from '../../services/api';

export interface RunningTextBannerProps {
  event?: ActiveEvent | null;
}

// ── Helper: Format Countdown ──
function formatCountdown(ms: number) {
  if (ms < 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  const s = seconds.toString().padStart(2, '0');
  
  if (days > 0) {
    return `${days} Hari ${h}:${m}:${s}`;
  }
  return `${h}:${m}:${s}`;
}

export function RunningTextBanner({ event }: RunningTextBannerProps) {
  const [toggleState, setToggleState] = useState(false);
  const [nearestEvent, setNearestEvent] = useState<ActiveEvent | null>(null);
  const [now, setNow] = useState(Date.now());

  // Ticker for current time (every 1 second)
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Toggle for crossfade (every 4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setToggleState((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fetch nearest event if no active event is provided (Konsep 1 Pause state)
  useEffect(() => {
    if (event) {
      setNearestEvent(event);
      return;
    }

    api.get('/api/events')
      .then(res => {
        const events = res.data;
        if (Array.isArray(events)) {
          const upcoming = events.filter(e => new Date(e.startDate).getTime() > Date.now());
          if (upcoming.length > 0) {
            upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
            setNearestEvent(upcoming[0]);
          }
        }
      })
      .catch(console.error);
  }, [event]);


  // ── LOGIC ──
  
  // Konsep 1 (Pause / No Active Event)
  if (!event) {
    const isWithinWeek = nearestEvent 
      ? new Date(nearestEvent.startDate).getTime() <= now + 7 * 24 * 60 * 60 * 1000 &&
        new Date(nearestEvent.startDate).getTime() > now
      : false;

    const displayText = isWithinWeek && nearestEvent ? nearestEvent.name : "SOUGEN CREATIVE MANAGEMENT";
    
    return (
      <BannerLayout 
        showSecondary={toggleState}
        primaryText={displayText}
        secondaryText="COMING SOON"
      />
    );
  }

  // Konsep 2 (Live / Active Event)
  // Calculate Exact Start and End times
  let startMs = new Date(event.startDate).getTime();
  let endMs = new Date(event.endDate).getTime();
  endMs = new Date(endMs).setHours(23, 59, 59, 999);

  if (event.eventDays && event.eventDays.length > 0) {
    const sortedDays = [...event.eventDays].sort((a, b) => a.dayNumber - b.dayNumber);
    const firstDay = sortedDays[0];
    const lastDay = sortedDays[sortedDays.length - 1];

    if (firstDay.rundownItems && firstDay.rundownItems.length > 0) {
      const sortedRundowns = [...firstDay.rundownItems].sort((a, b) => a.displayOrder - b.displayOrder);
      const [hours, minutes] = sortedRundowns[0].time.split(':').map(Number);
      const d = new Date(firstDay.date);
      d.setHours(hours, minutes, 0, 0);
      startMs = d.getTime();
    } else {
      const d = new Date(firstDay.date);
      d.setHours(8, 0, 0, 0); // Default 08:00 AM
      startMs = d.getTime();
    }

    if (lastDay.rundownItems && lastDay.rundownItems.length > 0) {
      const sortedRundowns = [...lastDay.rundownItems].sort((a, b) => a.displayOrder - b.displayOrder);
      const [hours, minutes] = sortedRundowns[sortedRundowns.length - 1].time.split(':').map(Number);
      const d = new Date(lastDay.date);
      d.setHours(hours, minutes, 0, 0);
      endMs = d.getTime();
    } else {
      const d = new Date(lastDay.date);
      d.setHours(23, 59, 59, 999);
      endMs = d.getTime();
    }
  }

  // Determine State
  const isBefore = now < startMs;
  const isAfter = now > endMs;
  const isDuring = !isBefore && !isAfter;

  let primaryText = "";
  let secondaryText = "";

  if (isBefore) {
    primaryText = "UPCOMING EVENT IN";
    secondaryText = formatCountdown(startMs - now);
  } else if (isDuring) {
    primaryText = "ONGOING EVENT";
    // Find current activity from rundown
    let currentActivity = "HAPPENING NOW";
    if (event.eventDays) {
      for (const day of event.eventDays) {
        if (!day.rundownItems || day.rundownItems.length === 0) continue;
        const sortedRundowns = [...day.rundownItems].sort((a, b) => a.displayOrder - b.displayOrder);
        for (let i = 0; i < sortedRundowns.length; i++) {
          const item = sortedRundowns[i];
          const nextItem = sortedRundowns[i + 1];
          const [h, m] = item.time.split(':').map(Number);
          const startT = new Date(day.date);
          startT.setHours(h, m, 0, 0);
          
          let endT = new Date(day.date);
          if (nextItem) {
            const [nh, nm] = nextItem.time.split(':').map(Number);
            endT.setHours(nh, nm, 0, 0);
          } else {
            endT.setHours(h + 2, m, 0, 0); // fallback +2 hours if last item
          }
          
          if (now >= startT.getTime() && now < endT.getTime()) {
            currentActivity = item.activityName;
            break;
          }
        }
      }
    }
    secondaryText = currentActivity;
  } else {
    // After event
    primaryText = "EVENT FINISHED";
    secondaryText = "THANK YOU FOR COMING";
  }

  return (
    <BannerLayout 
      showSecondary={toggleState}
      primaryText={primaryText}
      secondaryText={secondaryText}
    />
  );
}

// ── UI Components ──

function BannerText({ text }: { text: string }) {
  // If text is very long (> 25 chars), force marquee on desktop too
  const isMarqueeDesktop = text.length > 25;

  const marqueeInner = (
    <div className="flex w-fit animate-marquee-right">
      <div className="flex whitespace-nowrap">
        <span className="font-poppins text-2xl md:text-3xl font-black uppercase tracking-[0.10em] text-white pr-4">
          {text} • 
        </span>
        <span className="font-poppins text-2xl md:text-3xl font-black uppercase tracking-[0.10em] text-white pr-4">
          {text} • 
        </span>
      </div>
      <div className="flex whitespace-nowrap">
        <span className="font-poppins text-2xl md:text-3xl font-black uppercase tracking-[0.10em] text-white pr-4">
          {text} • 
        </span>
        <span className="font-poppins text-2xl md:text-3xl font-black uppercase tracking-[0.10em] text-white pr-4">
          {text} • 
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Always marquee on Mobile. Conditionally marquee on Desktop. */}
      <div className={cn("w-full overflow-hidden flex", isMarqueeDesktop ? "flex" : "md:hidden")}>
        {marqueeInner}
      </div>
      
      {/* Static on Desktop if short enough */}
      {!isMarqueeDesktop && (
        <h2 className="hidden md:block text-center font-poppins text-2xl md:text-3xl font-black uppercase tracking-[0.10em] text-white">
          {text}
        </h2>
      )}
    </>
  );
}

function BannerLayout({ 
  showSecondary, 
  primaryText, 
  secondaryText 
}: { 
  showSecondary: boolean; 
  primaryText: string; 
  secondaryText: string;
}) {
  return (
    <div className="w-full bg-sougen-blue py-4 md:py-5 overflow-hidden flex items-center justify-center relative">
      <div className="h-[32px] md:h-[36px] w-full flex items-center justify-center relative">
        
        {/* Primary State */}
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-1000",
            showSecondary ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <BannerText text={primaryText} />
        </div>

        {/* Secondary State */}
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-1000",
            showSecondary ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <BannerText text={secondaryText} />
        </div>

      </div>
    </div>
  );
}
