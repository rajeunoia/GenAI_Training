# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML-based GenAI training program consisting of:
- Main training content page (`GenAi_Training.html`)
- Training instructions page (`how_to_take_training.html`) 
- Six weekly evaluation quizzes (`evaluation/genai_week{1-6}_evaluation.html`)
- Simple redirect from `index.html` to the main training page

## Architecture

The project is a pure frontend application with no build process or dependencies:
- **Static HTML files**: All pages are standalone HTML files with embedded CSS and JavaScript
- **No framework dependencies**: Uses vanilla JavaScript and CSS
- **Self-contained**: Each file includes all necessary styles and scripts inline
- **Quiz system**: Evaluation pages contain embedded JavaScript quiz logic with randomized questions

## File Structure

- `/` - Root with main pages and redirect
- `/evaluation/` - Contains 6 weekly quiz HTML files
- Each quiz includes 20 questions but randomly selects 10 per attempt
- Consistent styling with dark theme across all pages

## Development Notes

This is a documentation/training project with no build, test, or lint commands - files are edited directly and opened in browsers for testing.