---
title: "VPS Hosting for Developers - Part 2: Hardening a Fresh Server"
meta_title: "How to Secure a Fresh VPS: SSH, Firewall, and Updates"
description: "A practical hardening checklist for a new Linux VPS: users, SSH keys, firewall rules, automatic updates, and the commands to verify each step."
date: 2026-04-28
image: "../../assets/images/vps-hardening.svg"
imageAlt: "Illustration of a shield and padlock protecting a server"
authors: ["dragos"]
categories: ["VPS Hosting"]
tags: ["vps", "security", "linux", "devops"]
series:
  name: "VPS Hosting for Developers"
  position: 2
---

A fresh VPS starts scanning itself within minutes of coming online. The goal of this part is not paranoia; it is to remove the handful of defaults that make a server easy to compromise, then verify that each change actually took effect.

Work in order, and keep a second terminal open so a mistake in SSH configuration does not lock you out.

## Before You Connect

Take a provider snapshot before making changes. It is the fastest undo button you will ever have. Then connect as root and create a working user:

```bash
adduser deploy
usermod -aG sudo deploy
```

From this point on, use the `deploy` user for everything. Root exists for emergencies.

## SSH Keys Instead of Passwords

On your local machine, generate a key if you do not have one:

```bash
ssh-keygen -t ed25519 -C "deploy@my-vps"
ssh-copy-id deploy@203.0.113.10
```

Then confirm key login works in a new terminal before touching the server configuration. Editing `sshd_config` first and testing second is how people lock themselves out.

## Harden the SSH Daemon

Edit `/etc/ssh/sshd_config` and set:

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
KbdInteractiveAuthentication no
```

Validate the file before restarting the service:

```bash
sudo sshd -t
sudo systemctl restart ssh
```

Leave the original session open until the new one succeeds. If something is wrong, you still have access to fix it.

## Turn On the Firewall

`ufw` is a friendly front end for `nftables` and is enough for most servers:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

Only 22, 80, and 443 are open. Databases and internal services stay on localhost and are reached through SSH tunnels or a private network — never exposed directly.

## Automatic Security Updates

Manual patching does not survive contact with a busy week. On Debian and Ubuntu:

```bash
sudo apt update
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

Check the configuration in `/etc/apt/apt.conf.d/20auto-upgrades` to confirm daily update checks and automatic security installs are on. Reboots still need a window you control; schedule them or monitor for the "reboot required" flag.

## A Few Extra Layers

- **fail2ban** adds temporary bans after repeated failed logins:
  ```bash
  sudo apt install fail2ban
  sudo systemctl enable --now fail2ban
  ```
- **Swap** keeps small instances alive during memory spikes:
  ```bash
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile && sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  ```
- **Time zone and time sync** make logs readable and TLS happier:
  ```bash
  sudo timedatectl set-timezone UTC
  sudo timedatectl set-ntp true
  ```

## Verify, Don't Assume

A hardening pass is only complete when you check it from the outside:

```bash
# Who is listening, and on which address?
sudo ss -tulpn

# Is the firewall really filtering?
sudo ufw status numbered

# Any failed login attempts already?
sudo journalctl -u ssh --since "1 hour ago" | grep -i failed
```

An external port scanner against your host should show exactly the ports you intended, and nothing else.

## Conclusion

Hardening is a short list of defaults done properly: a non-root user, keys only, a deny-by-default firewall, and updates on autopilot. In Part 3 we will put this server to work with Docker and Caddy, and get automatic HTTPS without touching a certificate again.
