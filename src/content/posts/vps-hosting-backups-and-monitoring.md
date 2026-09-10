---
title: "VPS Hosting for Developers - Part 4: Backups and Monitoring"
meta_title: "VPS Backups and Monitoring: A Practical Setup"
description: "Protect your server with the 3-2-1 backup rule, encrypted off-site snapshots, sensible monitoring, and a restore drill you run before you need it."
date: 2026-05-26
image: "../../assets/images/vps-backups.svg"
imageAlt: "Illustration of a database being copied to an off-site backup"
authors: ["dragos"]
categories: ["VPS Hosting"]
tags: ["vps", "backups", "monitoring", "devops"]
series:
  name: "VPS Hosting for Developers"
  position: 4
---

Nothing in the previous three parts matters if a bad deploy, a corrupted database, or a provider outage takes the data with it. The final part of this series is about the unglamorous work that lets you sleep: backups you can restore and alerts you can trust.

## The 3-2-1 Rule

Keep **three** copies of anything important, on **two** different media, with **one** copy off-site. On a single VPS that translates to:

1. The live data on the server.
2. A local snapshot or repository on the same machine (fast restores).
3. An encrypted copy in object storage or another provider (survives the server).

A provider snapshot alone is not a backup strategy; it lives in the same account as the thing it protects.

## What to Back Up

- Application data: databases, uploads, user files.
- Configuration: `/etc`, the Compose files, the Caddyfile.
- Secrets: `.env` files and certificate data, stored encrypted.
- Your own repositories, if the server is the only copy.

Skip caches, logs, and `node_modules`. They can be rebuilt.

## Encrypted Off-Site Backups with Restic

`restic` deduplicates and encrypts, so daily backups to cheap object storage stay small:

```bash
sudo apt install restic

export RESTIC_REPOSITORY=s3:https://s3.example.com/my-backups
export RESTIC_PASSWORD_FILE=/etc/restic/password

restic init
restic backup /srv /etc /home \
  --exclude '*.log' \
  --exclude '**/node_modules' \
  --exclude '**/cache'
```

Keep a retention policy so the repository does not grow forever:

```bash
restic forget --keep-daily 7 --keep-weekly 4 --keep-monthly 6 --prune
```

Run both from a systemd timer, and make sure the password file is readable only by root. Without it, the backups are noise.

## Monitoring That Earns Its Alerts

Three layers cover most small deployments:

| Layer | Question it answers | Tooling |
| --- | --- | --- |
| Uptime | Is the site reachable? | External checker, Uptime Kuma |
| Resources | Is the server healthy? | Netdata, node_exporter |
| Logs | What happened? | `journalctl`, `docker compose logs` |

Uptime checks must run from **outside** the server, or they cannot tell you the network is down. For resources, alert on the few signals that predict trouble: sustained CPU above 90%, memory above 85%, disk above 80%, and certificate expiry.

Send alerts somewhere you will actually see them — email, a chat webhook, or a push service. An alert channel nobody reads is worse than no monitoring, because it gives false confidence.

## Test a Restore Before You Need It

A backup that has never been restored is a hypothesis. Once a quarter:

```bash
restic snapshots
restic restore latest --target /tmp/restore-test
ls -la /tmp/restore-test/srv
```

Then go one step further: restore the site from the backup onto a fresh VM and confirm it serves traffic. The drill takes an hour and removes the guesswork from the worst day of the year.

## Conclusion

Backups are cheap while nothing is wrong and priceless afterwards. Encrypt, store off-site, alert from outside, and rehearse the restore. That is the whole series: choose a plan, harden the server, deploy with containers, and make the data survivable. From here, the next upgrade is automation — but only once each step works by hand.
