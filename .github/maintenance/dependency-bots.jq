# gh uses app/<slug>; REST fixtures may use <slug>[bot]. Never match bare usernames.
def dependency_bot:
  .is_bot != false and
  (.login == "app/renovate" or .login == "app/dependabot" or
   .login == "renovate[bot]" or .login == "dependabot[bot]");
