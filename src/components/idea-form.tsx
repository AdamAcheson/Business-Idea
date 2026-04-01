"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import type { IdeaFormData } from "@/lib/types";

interface IdeaFormProps {
  onSubmit: (data: IdeaFormData) => void;
  isLoading?: boolean;
}

const EMPTY_FORM: IdeaFormData = {
  companyName: "",
  offering: "",
  audience: "",
  problem: "",
  secretSauce: "",
  industry: "",
  businessType: "",
  geography: "",
  budget: "",
  founderBackground: "",
};

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "E-commerce",
  "Real Estate",
  "Food & Beverage",
  "Entertainment",
  "Manufacturing",
  "Energy",
  "Transportation",
  "Other",
];

const BUSINESS_TYPES = [
  "SaaS / Software",
  "Consumer Brand",
  "Services",
  "Finance / Fintech",
  "Marketplace",
  "Hardware",
  "Media / Content",
  "Other",
];

const BUDGETS = [
  "$0 - $10K",
  "$10K - $50K",
  "$50K - $100K",
  "$100K - $500K",
  "$500K+",
];

export function IdeaForm({ onSubmit, isLoading }: IdeaFormProps) {
  const [form, setForm] = useState<IdeaFormData>(EMPTY_FORM);
  const [showOptional, setShowOptional] = useState(false);

  const update = (field: keyof IdeaFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValid =
    form.companyName.trim() &&
    form.offering.trim() &&
    form.audience.trim() &&
    form.problem.trim() &&
    form.secretSauce.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onSubmit(form);
  };

  const previewSentence = `My Company ${form.companyName || "___"} is developing ${form.offering || "___"} to help ${form.audience || "___"} ${form.problem || "___"} with ${form.secretSauce || "___"}.`;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Describe Your Business Idea</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Required Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                placeholder="e.g. Acme Labs"
                value={form.companyName}
                onChange={(e) => update("companyName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offering">What are you building? *</Label>
              <Textarea
                id="offering"
                placeholder="e.g. An AI-powered scheduling platform that optimizes team calendars"
                rows={2}
                value={form.offering}
                onChange={(e) => update("offering", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Who is it for? *</Label>
              <Input
                id="audience"
                placeholder="e.g. Remote-first engineering teams with 10-50 members"
                value={form.audience}
                onChange={(e) => update("audience", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problem">What problem does it solve? *</Label>
              <Textarea
                id="problem"
                placeholder="e.g. Teams waste 5+ hours/week on scheduling conflicts and timezone coordination"
                rows={2}
                value={form.problem}
                onChange={(e) => update("problem", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secretSauce">
                What&apos;s your secret sauce? *
              </Label>
              <Textarea
                id="secretSauce"
                placeholder="e.g. Proprietary ML model trained on 10M calendar events that predicts optimal meeting windows with 95% accuracy"
                rows={2}
                value={form.secretSauce}
                onChange={(e) => update("secretSauce", e.target.value)}
              />
            </div>
          </div>

          {/* Sentence Preview */}
          <div className="bg-muted/50 rounded-lg p-4 border">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Your idea in one sentence:
            </p>
            <p className="text-sm italic leading-relaxed">{previewSentence}</p>
          </div>

          {/* Optional Fields Toggle */}
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showOptional ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {showOptional ? "Hide" : "Show"} optional fields
          </button>

          {showOptional && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={form.industry}
                    onValueChange={(v) => update("industry", v ?? "")}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select
                    value={form.businessType}
                    onValueChange={(v) => update("businessType", v ?? "")}
                  >
                    <SelectTrigger id="businessType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map((bt) => (
                        <SelectItem key={bt} value={bt}>
                          {bt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="geography">Target Geography</Label>
                  <Input
                    id="geography"
                    placeholder="e.g. United States, Global"
                    value={form.geography}
                    onChange={(e) => update("geography", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Available Budget</Label>
                  <Select
                    value={form.budget}
                    onValueChange={(v) => update("budget", v ?? "")}
                  >
                    <SelectTrigger id="budget">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGETS.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="founderBackground">Founder Background</Label>
                <Textarea
                  id="founderBackground"
                  placeholder="e.g. 10 years in enterprise SaaS, previously led product at Stripe"
                  rows={2}
                  value={form.founderBackground}
                  onChange={(e) => update("founderBackground", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full text-base"
            disabled={!isValid || isLoading}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Evaluate My Idea
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
