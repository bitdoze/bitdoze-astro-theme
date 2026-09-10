---
title: "VPS Hosting for Developers - Part 1: Choosing the Right Plan"
meta_title: "How to Choose a VPS for Development Projects"
description: "Read a VPS spec sheet without getting fooled: vCPU, RAM, storage, transfer, virtualization, and the questions to ask before you pay."
date: 2026-04-14
image: "../../assets/images/vps-choosing.svg"
imageAlt: "Illustration of server rows with a price tag"
authors: ["dragos"]
categories: ["VPS Hosting"]
tags: ["vps", "hosting", "linux", "infrastructure"]
series:
  name: "VPS Hosting for Developers"
  position: 1
---

A virtual private server is the middle ground between shared hosting you cannot control and a cloud account you can accidentally spend a fortune on. For a blog, a side project, or a small production stack, it is often the best value in hosting. The tricky part is the spec sheet, which is written to make every plan look generous.

This series walks from "which plan" to "well-run server." Part 1 is about choosing.

## What a VPS Actually Gives You

You get a virtual machine with root access on a physical host. That means:

- Your own operating system, kernel version, and package set.
- Guaranteed (or at least committed) CPU and RAM.
- A dedicated slice of storage and network.
- Full control over services, firewall, and backups.

You do not get the elasticity of a cloud provider or the hand-holding of managed hosting. You are the sysadmin.

## Read the Spec Sheet

Four numbers decide how a VPS feels in practice:

| Spec | What it really means | Watch out for |
| --- | --- | --- |
| vCPU | Share of a physical core | "Fair share" CPU can be throttled |
| RAM | Working memory for services | 1 GB is tight for Docker + database |
| Storage | Usually NVMe SSD | Network storage is slower than local NVMe |
| Transfer | Monthly outbound traffic | Inbound is often unmetered, outbound is not |

A useful rule of thumb for a small blog or API: 2 vCPU, 4 GB RAM, and 80 GB NVMe is comfortable; 1 vCPU and 2 GB works if you stay disciplined. Add a database and a Docker stack and the higher tier stops feeling like overkill.

## Virtualization: KVM vs. Containers

Most budget providers run one of two technologies:

- **KVM** gives you a real virtual machine with your own kernel. You can run Docker, custom kernels, and anything else. This is what you want.
- **Container-based (OpenVZ/LXC)** shares the host kernel. It is cheaper but limits kernel modules and can behave unpredictably under load.

If a plan is unusually cheap, check which one it uses. The difference shows up the first time you try to run Docker or change a network setting.

## Managed or Unmanaged?

Unmanaged means you get a root password and a wiki. Managed means the provider handles updates, monitoring, and sometimes the web stack.

For a developer, unmanaged plus your own automation is usually the better deal. The exception is if you have never administered a Linux server and the site is revenue-critical — in that case, spend the difference on a managed plan, or run through Part 2 of this series before you migrate anything important.

## Sizing for Common Workloads

| Workload | Minimum | Comfortable |
| --- | --- | --- |
| Static Astro site behind a CDN | 1 vCPU / 1 GB | 2 vCPU / 2 GB |
| Blog with a database and image processing | 2 vCPU / 2 GB | 2 vCPU / 4 GB |
| Docker stack: app, Postgres, Redis, reverse proxy | 2 vCPU / 4 GB | 4 vCPU / 8 GB |
| Small CI runner or staging environment | 2 vCPU / 4 GB | 4 vCPU / 8 GB |

Resize early rather than debugging out-of-memory kills later. Most providers let you upgrade with a reboot.

## The Provider Checklist

Before you pay, confirm:

1. **Snapshots or backups are included** (and how much they cost).
2. **KVM virtualization** if you plan to run containers.
3. **IPv6 support**, because a growing share of traffic prefers it.
4. **An API or CLI**, so a rebuild does not mean a support ticket.
5. **Data center locations** near your audience.
6. **A transparent bandwidth policy** — what happens after the cap?
7. **Monthly billing.** Annual prepay is cheaper, but run one full month first.

## Conclusion

Pick the boring plan from a provider that publishes its specs, then treat the server as something you own and operate. In Part 2 we will harden a fresh install so the first thing that touches it is your own SSH key — not a bot scanning port 22.
