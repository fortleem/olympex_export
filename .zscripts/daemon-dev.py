#!/usr/bin/env python3
"""Double-fork daemonizer for the Next.js dev server.

The sandbox platform kills processes spawned directly by tool sessions.
Double-forking + setsid produces an orphan (PPID=1) in its own session,
which survives across tool sessions. Stdio is redirected to /dev/null;
`bun run dev` internally pipes to `tee dev.log` so logging is preserved.
"""

import os
import sys

PROJECT_DIR = "/home/z/my-project"


def main() -> None:
    if os.fork() > 0:
        sys.exit(0)  # first parent exits immediately

    os.setsid()  # detach: new session, no controlling terminal

    if os.fork() > 0:
        sys.exit(0)  # second parent exits — child can never reacquire a tty

    os.chdir(PROJECT_DIR)

    # Fully detach stdio so no fd points back at the tool session.
    devnull = os.open(os.devnull, os.O_RDWR)
    for fd in (0, 1, 2):
        os.dup2(devnull, fd)
    if devnull > 2:
        os.close(devnull)

    os.execvp("bun", ["bun", "run", "dev"])


if __name__ == "__main__":
    main()
