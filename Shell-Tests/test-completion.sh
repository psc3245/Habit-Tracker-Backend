#!/usr/bin/env bash

BASE_URL="http://localhost:3000"
PASS_COUNT=0
FAIL_COUNT=0

function test_case() {
  local NAME="$1"
  local CMD="$2"
  local EXPECT="$3"

  echo "▶ $NAME"
  RESPONSE=$(eval "$CMD")
  STATUS=$(echo "$RESPONSE" | grep -Eo "HTTP/[0-9\.]+ [0-9]+" | tail -1 | awk '{print $2}')

  if [[ "$STATUS" == "$EXPECT" ]]; then
    echo "  ✅ PASS (status $STATUS)"
    PASS_COUNT=$((PASS_COUNT+1))
  else
    echo "  ❌ FAIL (expected $EXPECT, got $STATUS)"
    echo "$RESPONSE"
    FAIL_COUNT=$((FAIL_COUNT+1))
  fi
  echo
}

echo "===================================="
echo " Completion Tracker API Tests"
echo "===================================="
echo

# Setup: Create a user and habit first
echo "Setup: Creating test user and habit..."
curl -s -X POST $BASE_URL/users/signup \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@test.com","username":"testuser","pass":"password","dob":"2000-01-01"}' > /dev/null

curl -s -X POST $BASE_URL/habits \
  -H 'Content-Type: application/json' \
  -d '{"userId":1,"name":"Test Habit","type":"checkbox","schedule":"daily","target":1,"availableTags":["easy","hard"]}' > /dev/null

echo "Setup complete!"
echo

# -----------------------------
# CREATE
# -----------------------------
test_case "Create completion" \
"curl -i -s -X POST $BASE_URL/completions \
  -H 'Content-Type: application/json' \
  -d '{\"habitId\":1,\"userId\":1,\"date\":\"2026-01-29\",\"selectedTag\":\"easy\",\"value\":1}'" \
"201"

test_case "Create completion with missing required fields" \
"curl -i -s -X POST $BASE_URL/completions \
  -H 'Content-Type: application/json' \
  -d '{\"habitId\":1,\"date\":\"2026-01-29\"}'" \
"400"

test_case "Create completion for non-existent user" \
"curl -i -s -X POST $BASE_URL/completions \
  -H 'Content-Type: application/json' \
  -d '{\"habitId\":1,\"userId\":999,\"date\":\"2026-01-30\"}'" \
"400"

test_case "Create completion for non-existent habit" \
"curl -i -s -X POST $BASE_URL/completions \
  -H 'Content-Type: application/json' \
  -d '{\"habitId\":999,\"userId\":1,\"date\":\"2026-01-30\"}'" \
"400"

test_case "Create completion with invalid date format" \
"curl -i -s -X POST $BASE_URL/completions \
  -H 'Content-Type: application/json' \
  -d '{\"habitId\":1,\"userId\":1,\"date\":\"01-29-2026\"}'" \
"400"

test_case "Create duplicate completion (should update)" \
"curl -i -s -X POST $BASE_URL/completions \
  -H 'Content-Type: application/json' \
  -d '{\"habitId\":1,\"userId\":1,\"date\":\"2026-01-29\",\"selectedTag\":\"hard\",\"value\":2}'" \
"201"

# -----------------------------
# READ
# -----------------------------
test_case "Get all completions" \
"curl -i -s -X GET $BASE_URL/completions/all" \
"200"

test_case "Get completion by ID" \
"curl -i -s -X GET $BASE_URL/completions/1" \
"200"

test_case "Get non-existent completion by ID" \
"curl -i -s -X GET $BASE_URL/completions/999" \
"404"

test_case "Get completions by user and date" \
"curl -i -s -X GET '$BASE_URL/completions?userId=1&date=2026-01-29'" \
"200"

test_case "Get completions by user and date (missing params)" \
"curl -i -s -X GET '$BASE_URL/completions?userId=1'" \
"400"

test_case "Get completions by habit" \
"curl -i -s -X GET '$BASE_URL/completions/habit?habitId=1'" \
"200"

test_case "Get completions by habit (missing habitId)" \
"curl -i -s -X GET '$BASE_URL/completions/habit'" \
"400"

# -----------------------------
# UPDATE
# -----------------------------
test_case "Update completion" \
"curl -i -s -X PUT $BASE_URL/completions/1 \
  -H 'Content-Type: application/json' \
  -d '{\"selectedTag\":\"medium\",\"value\":5}'" \
"200"

test_case "Update completion with empty body" \
"curl -i -s -X PUT $BASE_URL/completions/1 \
  -H 'Content-Type: application/json' \
  -d '{}'" \
"400"

test_case "Update non-existent completion" \
"curl -i -s -X PUT $BASE_URL/completions/999 \
  -H 'Content-Type: application/json' \
  -d '{\"value\":10}'" \
"400"

test_case "Update completion with invalid ID" \
"curl -i -s -X PUT $BASE_URL/completions/abc \
  -H 'Content-Type: application/json' \
  -d '{\"value\":10}'" \
"400"

# -----------------------------
# DELETE
# -----------------------------
test_case "Delete completion" \
"curl -i -s -X DELETE $BASE_URL/completions/1" \
"200"

test_case "Delete already deleted completion" \
"curl -i -s -X DELETE $BASE_URL/completions/1" \
"404"

test_case "Delete with invalid ID" \
"curl -i -s -X DELETE $BASE_URL/completions/abc" \
"400"

# -----------------------------
# SUMMARY
# -----------------------------
echo "===================================="
echo " Test Summary"
echo "===================================="
echo " Passed: $PASS_COUNT"
echo " Failed: $FAIL_COUNT"

if [[ "$FAIL_COUNT" -eq 0 ]]; then
  echo " 🎉 ALL TESTS PASSED"
  exit 0
else
  echo " ❌ SOME TESTS FAILED"
  exit 1
fi