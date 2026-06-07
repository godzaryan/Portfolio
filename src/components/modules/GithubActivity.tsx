"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface GithubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
  };
  payload: any;
  created_at: string;
}

interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  fork: boolean;
  language: string;
  pushed_at: string;
}

export function GithubActivity() {
  const [events, setEvents] = useState<GithubEvent[]>([]);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const CACHE_KEY = "github_events_godzaryan";
        const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
        
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, reposData, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TIME) {
            setEvents(data);
            setRepos(reposData || []);
            setLoading(false);
            return;
          }
        }

        const [eventsRes, reposRes] = await Promise.all([
          fetch("https://api.github.com/users/godzaryan/events/public"),
          fetch("https://api.github.com/users/godzaryan/repos?sort=pushed&per_page=30")
        ]);

        if (!eventsRes.ok || !reposRes.ok) throw new Error("Failed to fetch");
        
        const data = await eventsRes.json();
        const allRepos = await reposRes.json();

        const recentEvents = data.slice(0, 4);
        
        // Filter out forks, sort by stars, then by recently pushed
        const topRepos = allRepos
          .filter((r: GithubRepo) => !r.fork)
          .sort((a: GithubRepo, b: GithubRepo) => {
            if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count;
            return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
          })
          .slice(0, 3);
        
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: recentEvents,
          reposData: topRepos,
          timestamp: Date.now()
        }));
        
        setEvents(recentEvents);
        setRepos(topRepos);
      } catch (err) {
        console.error("Github API error", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatEvent = (event: GithubEvent) => {
    const repoName = event.repo.name.replace("godzaryan/", "");
    switch (event.type) {
      case "PushEvent":
        return `PUSHED_CODE // ${repoName}`;
      case "CreateEvent":
        return `CREATED_${event.payload.ref_type?.toUpperCase() || 'REPO'} // ${repoName}`;
      case "WatchEvent":
        return `STARRED_REPO // ${repoName}`;
      case "PullRequestEvent":
        return `PR_${event.payload.action?.toUpperCase()} // ${repoName}`;
      case "IssuesEvent":
        return `ISSUE_${event.payload.action?.toUpperCase()} // ${repoName}`;
      case "DeleteEvent":
        return `DELETED_REF // ${repoName}`;
      default:
        return `SYSTEM_EVENT // ${repoName}`;
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return `JUST NOW`;
    if (minutes < 60) return `${minutes}M AGO`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}H AGO`;
    return `${Math.floor(hours / 24)}D AGO`;
  };

  return (
    <div className="flex flex-col border border-emerald-500/30 bg-glass p-3 lg:p-4 terminal-border shadow-lg group hover:border-emerald-500/60 transition-colors flex-shrink-0">
      <div className="text-emerald-500/50 text-[10px] lg:text-xs font-mono mb-2 lg:mb-3 flex items-center justify-between">
        <span>[ GITHUB_UPLINK ]</span>
        <div className="flex gap-1">
          <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-sm ${error ? "bg-red-500" : "bg-emerald-500/80 animate-pulse"}`} />
          <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-emerald-500/50 rounded-sm" />
        </div>
      </div>
      
      <div className="flex flex-col gap-2 font-mono text-[10px] lg:text-xs text-emerald-500/70">
        {loading ? (
          <div className="animate-pulse text-emerald-500/50 flex flex-col gap-2">
            <div className="h-4 bg-emerald-950/50 w-full" />
            <div className="h-4 bg-emerald-950/50 w-3/4" />
            <div className="h-4 bg-emerald-950/50 w-5/6" />
          </div>
        ) : error ? (
          <div className="text-red-400/80 py-2">ERR_CONNECTION_REFUSED</div>
        ) : events.length === 0 ? (
          <div className="text-emerald-500/40 py-2">NO_RECENT_ACTIVITY</div>
        ) : (
          events.map((ev, i) => (
            <motion.div 
              key={ev.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col border-b border-emerald-500/10 pb-1.5 last:border-0 group/item"
            >
              <div className="flex items-start justify-between gap-2">
                <a 
                  href={`https://github.com/${ev.repo.name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 group-hover/item:text-emerald-300 transition-colors truncate hover:underline"
                  title={ev.repo.name}
                >
                  <span className="opacity-50 mr-1">{">"}</span>
                  {formatEvent(ev)}
                </a>
                <span className="opacity-40 flex-shrink-0 text-[8px] lg:text-[9px] mt-0.5">
                  {getTimeAgo(ev.created_at)}
                </span>
              </div>
            </motion.div>
          ))
        )}

        <div className="mt-1 pt-2 border-t border-emerald-500/20 flex justify-between items-center text-[10px] lg:text-xs">
          <span className="opacity-50">STATUS</span>
          <a href="https://github.com/godzaryan" target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 hover:underline">
            LIVE_CONNECTION
          </a>
        </div>

        {repos.length > 0 && !loading && !error && (
          <div className="mt-2 pt-2 border-t border-emerald-500/20 flex flex-col gap-2">
            <span className="opacity-50 text-[9px] lg:text-[10px] mb-1">TOP_REPOSITORIES</span>
            {repos.map((repo, i) => (
              <motion.div 
                key={repo.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex flex-col border border-emerald-500/10 bg-emerald-950/20 p-1.5 hover:bg-emerald-500/10 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <a 
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 font-bold hover:underline truncate"
                  >
                    {repo.name}
                  </a>
                  <div className="flex gap-2 text-[9px] opacity-70 flex-shrink-0">
                    {repo.language && <span>{repo.language}</span>}
                    <span>★ {repo.stargazers_count}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
