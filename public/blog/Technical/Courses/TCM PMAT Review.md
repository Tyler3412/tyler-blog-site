**May 2, 2024**
## Table of Contents
1. Introduction
2. Prior Experience
3. An Overview of the Course
4. My Takeaways
## Introduction
The [TCM Practical Malware Analysis and Triage](https://academy.tcm-sec.com/p/practical-malware-analysis-triage) is an introductory level course to malware analysis. The course touches on the core steps an analyst would take upon receiving a sample. After running through the fundamentals, the curriculum begins to branch off into different types of malware.

This course is targetted towards IT security professionals as well as anyone interested in learning the skills required to analyze malware. PMAT heavily focuses on labs and hands on experience. These labs can be run in either a virtual machine or on a cloud lab. Due to the risky nature of the course contents, the instructor heavily focuses on safe malware handling.
## Prior Experience
By the time I took this course, I was a bit beyond the required prerequisites. Although it was stated that we didn't need to know x86 assembly, I found that practicing on [pwn.college](https://pwn.college/) prior to taking the course was immensely helpful. From previous reviews, I'd heard that the learning curve is massive when getting to the advanced analysis sections, but after practicing assembly for a bit, it felt very straightforward to me.

Another thing I did was take the malware analysis module on [HackTheBoxAcademy](https://academy.hackthebox.com/). While not 100% necessary, I found that this allowed me to move through this course a lot quicker. That being said, the PMAT felt like an extension of the HackTheBox module, solidifying the concepts I learned there.
## An Overview of The Course
I felt the course was structured well. The major sections include: 
- Lab building and safety
- Analysis fundamentals
- Specialty malware classes
- Challenges
- Reporting and Yara rules

In lab building and safety, we're walked through building our own malware analysis lab using FlareVM and REMnux. We're also given instructions on how to handle malware as well as limiting network connections for safety. Overall this section is fundamental for analysis, don't skip it.

The analysis fundamentals section covers both basic and advanced static and dynamic analysis. I felt that the basic static analysis section was a bit drawn on and could've been explained within one video, but this is also most likely due to the fact that I've done these steps quite a few times already. The basic dynamic analysis was paced appropriately and I picked up a couple of new techniques from it. As for the advanced analysis sections, I blazed through them having had experience doing a bit of reverse engineering in the past.

When analyzing the specialty malware classes, I felt like it was a great introduction to what's out there. That being said, the issue with breadth is often a lack of depth. In the future, I'd love to see a course that just goes through a bunch of samples with each different class. Overall I liked the section which is why I'd liked to have had more content in it.

Next we have the challenges. There were three challenges in the course. One for each of basic analysis, advanced analysis, and a course final. The basic analysis challenge was okay, although I wish we would've returned to it during advanced analysis. The other two challenges were pretty straightforwards. I went a bit beyond the course final challenge, which was analyzing WannaCry. That blog post will be up in a bit.

Lastly, we have the reporting and Yara rules sections. I really don't have too much to say about these. They're both extremely straightforward so not much explanation is needed.
## My Takeaways
Overall I think this course was great. It was certainly priced well, something I find that's often quite rare with courses in cybersecurity nowadays. From this course, I solidified my fundamentals within malware analysis and learned about analyzing some specialty malware classes. From here on out, I'll be branching out and analyzing more samples on my own, taking what I learned and further applying it to real world examples.