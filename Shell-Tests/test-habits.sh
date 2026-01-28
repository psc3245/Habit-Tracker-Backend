#!/usr/bin/env bash

BASE_URL="http://localhost:3000/habits"
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
echo " Habit API Integration Tests"
echo "===================================="
echo

# -----------------------------
# CREATE
# -----------------------------
test_case "Create habit (valid)" \
"curl -i -s -X POST $BASE_URL \
  -H 'Content-Type: application/json' \
  -d '{\"userId\":1,\"name\":\"Drink Water\",\"schedule\":\"Daily\",\"target\":8,\"createdAt\":\"2024-01-01\"}'" \
"201"

test_case "Create habit (missing required fields)" \
"curl -i -s -X POST $BASE_URL \
  -H 'Content-Type: application/json' \
  -d '{\"name\":\"Bad Habit\"}'" \
"400"

# -----------------------------
# READ
# -----------------------------
test_case "Get all habits" \
"curl -i -s -X GET $BASE_URL" \
"200"

# -----------------------------
# UPDATE
# -----------------------------
test_case "Update habit name" \
"curl -i -s -X PUT $BASE_URL/1 \
  -H 'Content-Type: application/json' \
  -d '{\"name\":\"Drink More Water\"}'" \
"200"

test_case "Update habit target" \
"curl -i -s -X PUT $BASE_URL/1 \
  -H 'Content-Type: application/json' \
  -d '{\"target\":10}'" \
"200"

test_case "Update habit with invalid id" \
"curl -i -s -X PUT $BASE_URL/abc \
  -H 'Content-Type: application/json' \
  -d '{\"name\":\"Nope\"}'" \
"400"

test_case "Update non-existent habit" \
"curl -i -s -X PUT $BASE_URL/999 \
  -H 'Content-Type: application/json' \
  -d '{\"name\":\"Ghost\"}'" \
"404"

test_case "Update with empty body" \
"curl -i -s -X PUT $BASE_URL/1 \
  -H 'Content-Type: application/json' \
  -d '{}' " \
"400"

# -----------------------------
# DELETE
# -----------------------------
test_case "Delete habit" \
"curl -i -s -X DELETE $BASE_URL/1" \
"204"

test_case "Delete same habit again" \
"curl -i -s -X DELETE $BASE_URL/1" \
"404"

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
