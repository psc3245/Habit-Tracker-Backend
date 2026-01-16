#!/usr/bin/env bash

BASE_URL="http://localhost:3000/users"
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
echo " User API Integration Tests"
echo "===================================="
echo

# -----------------------------
# CREATE
# -----------------------------
test_case "Create user" \
"curl -i -s -X POST $BASE_URL \
  -H 'Content-Type: application/json' \
  -d '{\"email\":\"test@test.com\",\"username\":\"test\",\"pass\":\"pw\",\"dob\":\"2000-01-01\"}'" \
"201"

# -----------------------------
# UPDATE
# -----------------------------
test_case "Update user username" \
"curl -i -s -X PUT $BASE_URL/1 \
  -H 'Content-Type: application/json' \
  -d '{\"username\":\"updated\"}'" \
"200"

test_case "Update non-existent user" \
"curl -i -s -X PUT $BASE_URL/999 \
  -H 'Content-Type: application/json' \
  -d '{\"username\":\"nope\"}'" \
"404"

# -----------------------------
# DELETE
# -----------------------------
test_case "Delete user" \
"curl -i -s -X DELETE $BASE_URL/1" \
"204"

test_case "Delete already deleted user" \
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

