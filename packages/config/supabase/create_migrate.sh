#!/bin/bash

# Apply changes to DB and generate migration
commit_name="${1// /_}";
supabase db diff --use-migra $commit_name -f $commit_name;

# Optionally, handle database reset or other tasks here
